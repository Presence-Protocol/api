"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventsFetcher_1 = require("./eventsFetcher");
const models_1 = require("./models");
async function startEventFetcher() {
    try {
        models_1.sequelize.sync().then(() => {
            console.log('Database connected');
        }).catch((error) => { console.error('Database connection error:', error); process.exit(1); });
        await (0, eventsFetcher_1.eventsFetcher)();
    }
    catch (error) {
        console.error('Event fetcher error:', error);
        process.exit(1);
    }
}
startEventFetcher();
