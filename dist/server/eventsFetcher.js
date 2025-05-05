"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsFetcher = eventsFetcher;
const web3_1 = require("@alephium/web3");
const models_1 = require("./models");
const deployments_1 = require("../artifacts/ts/deployments");
const models_2 = require("./models");
const PoapFactoryV2_1 = require("../artifacts/ts/PoapFactoryV2");
const deployment = (0, deployments_1.loadDeployments)(process.env.NETWORK ?? 'testnet'); // TODO use getNetwork()
const factoryContract = PoapFactoryV2_1.PoapFactoryV2.at(deployment.contracts.PoapFactory.contractInstance.address);
web3_1.web3.setCurrentNodeProvider(process.env.PUBLIC_NODE_URL ?? "https://node.testnet.alephium.org", undefined, undefined);
async function eventsFetcher() {
    let eventQueue = [];
    let batchId = 0;
    const BATCH_SIZE = 90;
    const BATCH_TIMEOUT = 5000;
    // Check if tables are empty
    const poapCount = await models_2.Poap.count();
    const collectionCount = await models_2.Collection.count();
    const onChainCounter = await factoryContract.getContractEventsCurrentCount();
    // If both tables are empty, start from 0
    const startCounter = (poapCount === 0 && collectionCount === 0) ? 0 : onChainCounter;
    async function processBatch(events, batchId) {
        const t = await models_1.sequelize.transaction();
        const timerLabel = `batch-process-${batchId}-${Date.now()}`;
        console.time(timerLabel);
        try {
            const poapEvents = events.filter(e => e.name === "PoapMinted");
            const collectionEvents = events.filter(e => e.name === "EventCreated");
            await Promise.all([
                // Batch process POAPs
                poapEvents.length > 0 && models_2.Poap.bulkCreate(poapEvents.map(event => ({
                    contractId: event.fields.contractId,
                    collectionContractId: event.fields.collectionId,
                    nftIndex: Number(event.fields.nftIndex),
                    caller: event.fields.caller,
                    isPublic: event.fields.isPublic
                })), {
                    transaction: t,
                    updateOnDuplicate: ["collectionContractId", "nftIndex", "caller"]
                }),
                // Batch process Collections
                collectionEvents.length > 0 && models_2.Collection.bulkCreate(collectionEvents.map(event => ({
                    contractId: event.fields.contractId,
                    eventName: (0, web3_1.hexToString)(event.fields.eventName),
                    caller: event.fields.organizer,
                    isPublic: event.fields.isPublic,
                    disabled: event.fields.disabled
                })), {
                    transaction: t,
                    updateOnDuplicate: ["eventName", "caller"]
                })
            ]);
            await t.commit();
            console.timeEnd(timerLabel);
            console.log(`Processed batch ${batchId} with ${events.length} events`);
        }
        catch (error) {
            await t.rollback();
            console.error(`Batch ${batchId} processing error:`, error);
        }
    }
    let subscription = null;
    function startListener(fromCounter) {
        subscription = factoryContract.subscribeAllEvents({
            pollingInterval: 5000,
            messageCallback: async (event) => {
                eventQueue.push(event);
                if (event.name === "PoapMinted") {
                    const testevent = event;
                    console.log(`PoapMinted: ${testevent.fields.contractId} ${testevent.fields.collectionId} ${testevent.fields.nftIndex} ${testevent.fields.caller}`);
                }
                if (eventQueue.length >= BATCH_SIZE) {
                    await processBatch([...eventQueue], batchId++);
                    eventQueue = [];
                }
            },
            errorCallback: async (error, subscription) => {
                console.error(`Error from contract factory:`, error);
                // Unsubscribe and restart after a delay
                subscription.unsubscribe();
                console.log('Restarting listener in 10 seconds...');
                setTimeout(() => {
                    startListener(startCounter);
                }, 10000);
            }
        }, fromCounter);
    }
    startListener(startCounter);
    await models_2.EventStat.upsert({ id: 1, processedCounter: startCounter });
    console.log(`Starting event fetcher from block: ${startCounter}`);
    // Process remaining events periodically
    setInterval(async () => {
        if (eventQueue.length > 0) {
            await processBatch([...eventQueue], batchId++);
            eventQueue = [];
        }
    }, BATCH_TIMEOUT);
}
