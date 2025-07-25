import { web3, Contract, MINIMAL_CONTRACT_DEPOSIT, DUST_AMOUNT, Subscription, contractIdFromAddress, addressFromContractId, hexToString, NetworkId } from '@alephium/web3'
import { Transaction, Op, where } from 'sequelize';
import { sequelize } from './models';

import { loadDeployments } from '../artifacts/ts/deployments'
import { Collection, Series, PoapSerie, Poap, EventStat } from './models';
import { PoapFactoryV2, PoapFactoryV2Types } from '../artifacts/ts/PoapFactoryV2';
import { PoapFactory, PoapFactoryTypes } from '../artifacts/ts/PoapFactory';



const deployment = loadDeployments(process.env.NETWORK as NetworkId ?? 'testnet'); // TODO use getNetwork()
if(deployment.contracts.PoapFactoryV2 === undefined) {
  console.error("PoapFactoryV2 contract not found in deployment");
  process.exit(1);
}

let factoryContractV1Address = process.env.FACTORY_V1_ADDRESS ?? 'vUqaS4RGwaZ2NrjKgQr4etD4v3tVReuUKTtrdypSveaT'
if(deployment.contracts.PoapFactory === undefined) {
  console.error("PoapFactory contract not found in deployment");
}


const factoryContract = PoapFactory.at(factoryContractV1Address);
const factoryContractV2 = PoapFactoryV2.at(deployment.contracts.PoapFactoryV2.contractInstance.address);

web3.setCurrentNodeProvider(
    process.env.PUBLIC_NODE_URL ?? "https://node.testnet.alephium.org",
    undefined,
    undefined
  );


export async function eventsFetcher() {
  let eventQueue: any[] = [];
  let batchId = 0;
  const BATCH_SIZE = 90;
  const BATCH_TIMEOUT = 5000;

  // Check if tables are empty
  const poapCount = await Poap.count();
  const collectionCount = await Collection.count();
  
  const onChainCounterV2 = await factoryContractV2.getContractEventsCurrentCount();
  const onChainCounterV1 = await factoryContract.getContractEventsCurrentCount();

  // If both tables are empty, start from 0
  const startCounter = (poapCount === 0 && collectionCount === 0) ? 0 : Math.min(onChainCounterV1, onChainCounterV2);


  async function processBatch(events: any[], batchId: number) {
    const t = await sequelize.transaction();
    const timerLabel = `batch-process-${batchId}-${Date.now()}`;
    console.time(timerLabel);
    
    try {
      const poapEvents = events.filter(e => e.name === "PoapMinted");
      const collectionEvents = events.filter(e => e.name === "EventCreated");
      const serieAddedEvents = events.filter(e => e.name === "SerieAdded");
      const poapSerieMintedEvents = events.filter(e => e.name === "PoapSerieMinted");
      

      await Promise.all([
        // Batch process POAPs
        poapEvents.length > 0 && Poap.bulkCreate(
          poapEvents.map(event => ({
            contractId: event.fields.contractId,
            collectionContractId: event.fields.collectionId,
            nftIndex: Number(event.fields.nftIndex),
            caller: event.fields.caller,
            isPublic: event.fields.isPublic
          })), 
          { 
            transaction: t,
            updateOnDuplicate: ["collectionContractId", "nftIndex", "caller"]
          }
        ),

        // Batch process Collections
        collectionEvents.length > 0 && Collection.bulkCreate(
          collectionEvents.map(event => ({
            contractId: event.fields.contractId,
            eventName: hexToString(event.fields.eventName),
            caller: event.fields.organizer,
            isPublic: event.fields.isPublic,
            disabled: event.fields.disabled
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventName", "caller"]
          }
        ),

        // Batch process Serie Added Events
        serieAddedEvents.length > 0 && Series.bulkCreate(
          serieAddedEvents.map(event => ({
            contractId: event.fields.eventContractId,
            collectionContractId: event.fields.collectionId,
            eventName: hexToString(event.fields.eventName),
            organizer: event.fields.organizer,
            isPublic: event.fields.isPublic
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventName", "organizer"]
          }
        ),

        // Batch process PoapSerieMinted Events
        poapSerieMintedEvents.length > 0 && PoapSerie.bulkCreate(
          poapSerieMintedEvents.map(event => ({
            contractId: event.fields.contractId,
            collectionContractId: event.fields.collectionId,
            eventId: Number(event.fields.eventId),
            nftIndex: Number(event.fields.nftIndex),
            caller: event.fields.caller,
            isPublic: event.fields.isPublic
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventId", "nftIndex", "caller"]
          }
        )
      ]);

      await t.commit();
      console.timeEnd(timerLabel);
      console.log(`Processed batch ${batchId} with ${events.length} events`);

    } catch (error) {
      await t.rollback();
      console.error(`Batch ${batchId} processing error:`, error);
    }
  }

  let subscriptionV1: Subscription<any> | null = null;
  let subscriptionV2: Subscription<any> | null = null;

  function startListener(fromCounter: number) {
    // Start listening to V1 events
    subscriptionV1 = factoryContract.subscribeAllEvents({
      pollingInterval: 5000,
      messageCallback: async (event) => {
        eventQueue.push(event);
        if(event.name === "PoapMinted") {
          const testevent = event as PoapFactoryTypes.PoapMintedEvent;
          console.log(`PoapMinted V1: ${testevent.fields.contractId} ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.caller}`);
        }
        if (eventQueue.length >= BATCH_SIZE) {
          await processBatch([...eventQueue], batchId++);
          eventQueue = [];
        }
      },
      errorCallback: async (error, subscription) => {
        console.error(`Error from contract factory V1:`, error);
        subscription.unsubscribe();
        console.log('Restarting V1 listener in 10 seconds...');
        setTimeout(() => {
          startListener(startCounter);
        }, 10000);
      }
    }, fromCounter);

    // Start listening to V2 events
    subscriptionV2 = factoryContractV2.subscribeAllEvents({
      pollingInterval: 5000,
      messageCallback: async (event) => {
        eventQueue.push(event);
        if(event.name === "PoapMinted") {
          const testevent = event as PoapFactoryV2Types.PoapMintedEvent;
          console.log(`PoapMinted V2: ${testevent.fields.contractId} ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.caller}`);
        }

        if (event.name === "SerieAdded") {
          const testevent = event as PoapFactoryV2Types.SerieAddedEvent;
          console.log(`Series added V2: ${testevent.fields.collectionId} ${testevent.fields.eventContractId} ${testevent.fields.eventName} ${testevent.fields.organizer} ${testevent.fields.isPublic}`);
        }

        if (event.name === "PoapSerieMinted") {
          const testevent = event as PoapFactoryV2Types.PoapSerieMintedEvent;
          console.log(`PoapSerieMinted V2: ${testevent.fields.contractId} ${testevent.fields.caller} ${testevent.fields.eventId} ${testevent.fields.nftIndex} ${testevent.fields.timestamp}`);
        }


        if (eventQueue.length >= BATCH_SIZE) {
          await processBatch([...eventQueue], batchId++);
          eventQueue = [];
        }
      },
      errorCallback: async (error, subscription) => {
        console.error(`Error from contract factory V2:`, error);
        subscription.unsubscribe();
        console.log('Restarting V2 listener in 10 seconds...');
        setTimeout(() => {
          startListener(startCounter);
        }, 10000);
      }
    }, fromCounter);
  }

  startListener(startCounter);

  
  await EventStat.upsert(
    { id: 1, processedCounter: startCounter },
  );

  console.log(`Starting event fetcher from block: ${startCounter}`);

  // Process remaining events periodically
  setInterval(async () => {
    if (eventQueue.length > 0) {
      await processBatch([...eventQueue], batchId++);
      eventQueue = [];
    }
  }, BATCH_TIMEOUT);
}

