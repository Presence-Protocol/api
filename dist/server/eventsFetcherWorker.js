"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventsFetcher_1 = require("./eventsFetcher");
async function startEventFetcher() {
    try {
        await (0, eventsFetcher_1.eventsFetcher)();
    }
    catch (error) {
        console.error('Event fetcher error:', error);
        // Retry after 5 seconds
        setTimeout(startEventFetcher, 5000);
    }
}
startEventFetcher();
