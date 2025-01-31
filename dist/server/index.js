"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const routes_1 = __importDefault(require("./routes"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api', routes_1.default);
// Start event fetcher in background
const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, 'eventsFetcherWorker.js'));
worker.on('error', (error) => {
    console.error('Event fetcher worker error:', error);
});
worker.on('exit', (code) => {
    if (code !== 0) {
        console.log('Event fetcher worker stopped. Restarting...');
        new worker_threads_1.Worker(path_1.default.join(__dirname, 'eventsFetcherWorker.js'));
    }
});
models_1.sequelize.sync()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Database sync failed:', error);
});
