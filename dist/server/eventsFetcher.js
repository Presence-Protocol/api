"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsFetcher = eventsFetcher;
const web3_1 = require("@alephium/web3");
const PoapFactory_1 = require("../artifacts/ts/PoapFactory");
const deployments_1 = require("../artifacts/ts/deployments");
const models_1 = require("./models");
const deployment = (0, deployments_1.loadDeployments)('testnet'); // TODO use getNetwork()
const factoryContract = PoapFactory_1.PoapFactory.at(deployment.contracts.PoapFactory.contractInstance.address);
web3_1.web3.setCurrentNodeProvider(process.env.NEXT_PUBLIC_NODE_URL ?? "https://node.testnet.alephium.org", undefined, undefined);
async function eventsFetcher() {
    factoryContract.subscribeAllEvents({
        pollingInterval: 5000,
        messageCallback: async (event) => {
            switch (event.name) {
                case "PoapMinted":
                    const eventMinted = event;
                    const existingPoap = await models_1.Poap.findOne({
                        where: { contractId: eventMinted.fields.contractId }
                    });
                    if (!existingPoap) {
                        await models_1.Poap.create({
                            contractId: eventMinted.fields.contractId,
                            collectionContractId: eventMinted.fields.collectionId,
                            nftIndex: Number(eventMinted.fields.nftIndex),
                            caller: eventMinted.fields.caller
                        });
                        console.log(`Created new POAP: ${eventMinted.fields.contractId}`);
                    }
                    else {
                        console.log(`POAP already exists: ${eventMinted.fields.contractId}`);
                    }
                    break;
                case "EventCreated":
                    const eventData = event;
                    const existingCollection = await models_1.Collection.findOne({
                        where: { contractId: eventData.fields.contractId }
                    });
                    if (!existingCollection) {
                        await models_1.Collection.create({
                            contractId: eventData.fields.contractId,
                            eventName: (0, web3_1.hexToString)(eventData.fields.eventName),
                            caller: eventData.fields.organizer
                        });
                        console.log(`Created new collection: ${eventData.fields.contractId}`);
                    }
                    else {
                        console.log(`Collection already exists: ${eventData.fields.contractId}`);
                    }
                    break;
                default:
                    break;
            }
            return Promise.resolve();
        },
        errorCallback: (error, subscription) => {
            console.error(`Error from contract factory:`, error);
            subscription.unsubscribe();
            return Promise.resolve();
        }
    });
}
