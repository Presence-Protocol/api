"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.get('/events/minted/:collectionid', async (req, res) => {
    try {
        console.log(req.params);
        const events = await models_1.Poap.findAll({ where: { collectionContractId: req.params.collectionid }, order: [['createdAt', 'DESC']], limit: parseInt(req.query.limit) || 10 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/events/minted-list/:collectionid', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: events } = await models_1.Poap.findAndCountAll({
            where: { collectionContractId: req.params.collectionid },
            attributes: ['caller'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            addresses: events.map(event => event.caller),
            pagination: {
                total: count,
                limit,
                offset,
                hasMore: offset + limit < count
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/events', async (req, res) => {
    try {
        const events = await models_1.Collection.findAll({ where: { isPublic: true, disabled: false }, order: [['createdAt', 'DESC']], limit: parseInt(req.query.limit) || 10 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/poap/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { unique } = req.query;
        let poaps;
        if (unique === 'true') {
            poaps = await models_1.Poap.findAll({
                where: { caller: address },
                attributes: [
                    [models_1.sequelize.fn('DISTINCT', models_1.sequelize.col('collectionContractId')), 'collectionContractId'],
                    'contractId',
                    'nftIndex',
                    'caller',
                    'isPublic',
                    'createdAt',
                    [models_1.sequelize.fn('COUNT', models_1.sequelize.col('collectionContractId')), 'count']
                ],
                group: ['collectionContractId'],
                order: [['createdAt', 'DESC']]
            });
        }
        else {
            poaps = await models_1.Poap.findAll({
                where: { caller: address },
                order: [['createdAt', 'DESC']]
            });
        }
        res.json(poaps);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/events/:address', async (req, res) => {
    try {
        const collectionMinterByUser = await models_1.Collection.findAll({ where: { caller: req.params.address }, order: [['createdAt', 'DESC']], limit: parseInt(req.query.limit) || 20 });
        console.log(req.params);
        if (collectionMinterByUser) {
            res.json(collectionMinterByUser);
        }
        else {
            res.status(404).json({ error: 'Not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/events/stats/totaladdresses', async (req, res) => {
    try {
        const eventCounts = await models_1.Collection.findAll({
            attributes: [
                'caller',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'eventCount']
            ],
            group: ['caller'],
            order: [[models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        if (eventCounts) {
            res.json(eventCounts);
        }
        else {
            res.status(404).json({ error: 'Not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/poap/stats/totaladdresses', async (req, res) => {
    try {
        const eventCounts = await models_1.Poap.findAll({
            attributes: [
                'caller',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'eventCount']
            ],
            group: ['caller'],
            order: [[models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        if (eventCounts) {
            res.json(eventCounts);
        }
        else {
            res.status(404).json({ error: 'Not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/stats/total', async (req, res) => {
    try {
        const totalCollections = await models_1.Collection.count();
        const totalPoaps = await models_1.Poap.count();
        res.json({
            totalCollections,
            totalPoaps
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
