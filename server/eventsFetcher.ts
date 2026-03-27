import { web3, Contract, MINIMAL_CONTRACT_DEPOSIT, DUST_AMOUNT, Subscription, contractIdFromAddress, addressFromContractId, hexToString, NetworkId } from '@alephium/web3'
import { Transaction, Op, where } from 'sequelize';
import { sequelize } from './models';

import { loadDeployments } from '../artifacts/ts/deployments'
import { Collection, SeriesCollection, SeriesEvent, PoapSerie, Poap, EventStat } from './models';
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

// Helper function to remove group suffix (e.g., ":0", ":1") from addresses
function normalizeAddress(address: string): string {
  const colonIndex = address.indexOf(':');
  if (colonIndex !== -1) {
    return address.substring(0, colonIndex);
  }
  return address;
}

/** Runtime EventSubscription exposes this; generated contract typings only list Subscription. */
function resumeEventIndex(sub: Subscription<any>): number {
  return (sub as Subscription<any> & { currentEventCount(): number }).currentEventCount();
}

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
      const poapParticipatedEvents = events.filter(e => e.name === "PoapParticipatedIn");


      await Promise.all([
        // Batch process POAPs
        poapEvents.length > 0 && Poap.bulkCreate(
          poapEvents.map(event => ({
            contractId: event.fields.contractId,
            collectionContractId: event.fields.collectionId,
            nftIndex: Number(event.fields.nftIndex),
            caller: normalizeAddress(event.fields.caller),
            isPublic: event.fields.isPublic
          })), 
          { 
            transaction: t,
            updateOnDuplicate: ["collectionContractId", "nftIndex", "caller"]
          }
        ),

        // Batch process single event Collections (non-series)
        collectionEvents.filter(e => !e.fields.isSeries).length > 0 && Collection.bulkCreate(
          collectionEvents.filter(e => !e.fields.isSeries).map(event => ({
            contractId: event.fields.contractId,
            eventName: hexToString(event.fields.eventName),
            caller: normalizeAddress(event.fields.organizer),
            isPublic: event.fields.isPublic,
            disabled: event.fields.disabled || false
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventName", "caller"]
          }
        ),

        // Batch process series Collections (isSeries = true)
        collectionEvents.filter(e => e.fields.isSeries).length > 0 && SeriesCollection.bulkCreate(
          collectionEvents.filter(e => e.fields.isSeries).map(event => ({
            contractId: event.fields.contractId,
            eventName: hexToString(event.fields.eventName),
            caller: normalizeAddress(event.fields.organizer),
            isPublic: event.fields.isPublic,
            disabled: event.fields.disabled || false
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventName", "caller"]
          }
        ),

        // Batch process Serie Added Events (events within a series)
        serieAddedEvents.length > 0 && SeriesEvent.bulkCreate(
          serieAddedEvents.map(event => ({
            contractId: event.fields.eventContractId,
            seriesContractId: event.fields.collectionId,
            eventName: hexToString(event.fields.eventName),
            eventId: Number(event.fields.eventId),
            organizer: normalizeAddress(event.fields.organizer),
            isPublic: event.fields.isPublic
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventName", "eventId", "organizer"]
          }
        ),

        // Batch process PoapSerieMinted Events
        poapSerieMintedEvents.length > 0 && PoapSerie.bulkCreate(
          poapSerieMintedEvents.map(event => ({
            contractId: event.fields.contractId,
            seriesContractId: event.fields.collectionId,
            eventId: Number(event.fields.eventId),
            nftIndex: Number(event.fields.nftIndex),
            caller: normalizeAddress(event.fields.caller),
            isPublic: event.fields.isPublic
          })),
          {
            transaction: t,
            updateOnDuplicate: ["eventId", "nftIndex", "caller"]
          }
        )
      ]);

      // Process participation events - these update existing records
      if (poapParticipatedEvents.length > 0) {
        for (const event of poapParticipatedEvents) {
          await Poap.update(
            { hasParticipated: true },
            {
              where: {
                collectionContractId: event.fields.collectionId,
                nftIndex: Number(event.fields.nftIndex)
              },
              transaction: t
            }
          );
        }
      }

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
  let lastV1EventCount = startCounter;
  let lastV2EventCount = startCounter;

  function persistEventProgress() {
    const minCount = Math.min(lastV1EventCount, lastV2EventCount);
    EventStat.upsert({ id: 1, processedCounter: minCount }).catch((err) =>
      console.error('EventStat upsert failed:', err)
    );
  }

  /** Backoff when the node is flaky (e.g. ETIMEDOUT); caps at 60s. Resets on successful progress. */
  let v1RestartAttempt = 0;
  let v2RestartAttempt = 0;
  function restartDelayMs(attempt: number) {
    return Math.min(60_000, 10_000 * Math.pow(2, Math.min(attempt, 3)));
  }

  function startV1Listener(fromCounter: number) {
    subscriptionV1?.unsubscribe();
    subscriptionV1 = factoryContract.subscribeAllEvents(
      {
        pollingInterval: 5000,
        onEventCountChanged: async (count) => {
          lastV1EventCount = count;
          v1RestartAttempt = 0;
          persistEventProgress();
        },
        messageCallback: async (event) => {
          eventQueue.push(event);
          if (event.name === 'PoapMinted') {
            const testevent = event as PoapFactoryTypes.PoapMintedEvent;
            console.log(
              `PoapMinted V1: ${testevent.fields.contractId} ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.caller}`
            );
          }
          if (eventQueue.length >= BATCH_SIZE) {
            await processBatch([...eventQueue], batchId++);
            eventQueue = [];
          }
        },
        errorCallback: async (error, subscription) => {
          console.error(`Error from contract factory V1:`, error);
          const resumeFrom = resumeEventIndex(subscription);
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('V1 unsubscribe error:', e);
          }
          const delay = restartDelayMs(v1RestartAttempt++);
          console.log(`Restarting V1 listener from event index ${resumeFrom} in ${delay}ms...`);
          setTimeout(() => startV1Listener(resumeFrom), delay);
        },
      },
      fromCounter
    );
  }

  function startV2Listener(fromCounter: number) {
    subscriptionV2?.unsubscribe();
    subscriptionV2 = factoryContractV2.subscribeAllEvents(
      {
        pollingInterval: 5000,
        onEventCountChanged: async (count) => {
          lastV2EventCount = count;
          v2RestartAttempt = 0;
          persistEventProgress();
        },
        messageCallback: async (event) => {
          eventQueue.push(event);
          if (event.name === 'PoapMinted') {
            const testevent = event as PoapFactoryV2Types.PoapMintedEvent;
            console.log(
              `PoapMinted V2: ${testevent.fields.contractId} ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.caller}`
            );
          }

          if (event.name === 'SerieAdded') {
            const testevent = event as PoapFactoryV2Types.SerieAddedEvent;
            console.log(
              `Series added V2: ${testevent.fields.collectionId} ${testevent.fields.eventContractId} ${testevent.fields.eventId} ${testevent.fields.eventName} ${testevent.fields.organizer} ${testevent.fields.isPublic}`
            );
          }

          if (event.name === 'PoapSerieMinted') {
            const testevent = event as PoapFactoryV2Types.PoapSerieMintedEvent;
            console.log(
              `PoapSerieMinted V2: ${testevent.fields.contractId} ${testevent.fields.caller} ${testevent.fields.eventId} ${testevent.fields.nftIndex} ${testevent.fields.timestamp}`
            );
          }

          if (event.name === 'PoapParticipatedIn') {
            const testevent = event as PoapFactoryV2Types.PoapParticipatedInEvent;
            console.log(
              `PoapParticipatedIn V2: ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.organizerAddress}`
            );
          }

          if (eventQueue.length >= BATCH_SIZE) {
            await processBatch([...eventQueue], batchId++);
            eventQueue = [];
          }
        },
        errorCallback: async (error, subscription) => {
          console.error(`Error from contract factory V2:`, error);
          const resumeFrom = resumeEventIndex(subscription);
          try {
            subscription.unsubscribe();
          } catch (e) {
            console.error('V2 unsubscribe error:', e);
          }
          const delay = restartDelayMs(v2RestartAttempt++);
          console.log(`Restarting V2 listener from event index ${resumeFrom} in ${delay}ms...`);
          setTimeout(() => startV2Listener(resumeFrom), delay);
        },
      },
      fromCounter
    );
  }

  startV1Listener(startCounter);
  startV2Listener(startCounter);

  
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

