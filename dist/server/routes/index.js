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
// New endpoints for Series
router.get('/series', async (req, res) => {
    try {
        const series = await models_1.Series.findAll({
            where: { isPublic: true },
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit) || 10
        });
        res.json(series);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/series/:collectionId', async (req, res) => {
    try {
        const series = await models_1.Series.findAll({
            where: { collectionContractId: req.params.collectionId },
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        res.json(series);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/series/organizer/:address', async (req, res) => {
    try {
        const series = await models_1.Series.findAll({
            where: { organizer: req.params.address },
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        res.json(series);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// New endpoints for PoapSerie
router.get('/poap-serie/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { unique } = req.query;
        let poapSeries;
        if (unique === 'true') {
            poapSeries = await models_1.PoapSerie.findAll({
                where: { caller: address },
                attributes: [
                    [models_1.sequelize.fn('DISTINCT', models_1.sequelize.col('collectionContractId')), 'collectionContractId'],
                    'contractId',
                    'eventId',
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
            poapSeries = await models_1.PoapSerie.findAll({
                where: { caller: address },
                order: [['createdAt', 'DESC']]
            });
        }
        res.json(poapSeries);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/poap-serie/minted/:seriesId', async (req, res) => {
    try {
        const poapSeries = await models_1.PoapSerie.findAll({
            where: { collectionContractId: req.params.seriesId },
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit) || 10
        });
        res.json(poapSeries);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/poap-serie/minted-list/:seriesId', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: poapSeries } = await models_1.PoapSerie.findAndCountAll({
            where: { collectionContractId: req.params.seriesId },
            attributes: ['caller'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            addresses: poapSeries.map(poap => poap.caller),
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
// Updated stats endpoint
router.get('/stats/total', async (req, res) => {
    try {
        const totalCollections = await models_1.Collection.count();
        const totalSeries = await models_1.Series.count();
        const totalPoaps = await models_1.Poap.count();
        const totalPoapSeries = await models_1.PoapSerie.count();
        res.json({
            totalCollections,
            totalSeries,
            totalPoaps,
            totalPoapSeries
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// New stats endpoints
router.get('/series/stats/totaladdresses', async (req, res) => {
    try {
        const seriesCounts = await models_1.Series.findAll({
            attributes: [
                'organizer',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'seriesCount']
            ],
            group: ['organizer'],
            order: [[models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        res.json(seriesCounts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/poap-serie/stats/totaladdresses', async (req, res) => {
    try {
        const poapSerieCounts = await models_1.PoapSerie.findAll({
            attributes: [
                'caller',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'poapSerieCount']
            ],
            group: ['caller'],
            order: [[models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'DESC']],
            limit: parseInt(req.query.limit) || 20
        });
        res.json(poapSerieCounts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// New routes for multiple presences per event in series
// Get all presences for a specific event within a series
router.get('/poap-serie/:seriesId/event/:eventId', async (req, res) => {
    try {
        const { seriesId, eventId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: presences } = await models_1.PoapSerie.findAndCountAll({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId)
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            presences,
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
// Get list of addresses that attended a specific event in a series
router.get('/poap-serie/:seriesId/event/:eventId/addresses', async (req, res) => {
    try {
        const { seriesId, eventId } = req.params;
        const limit = parseInt(req.query.limit) || 1000;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: presences } = await models_1.PoapSerie.findAndCountAll({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId)
            },
            attributes: ['caller', 'nftIndex', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            addresses: presences.map(p => ({
                address: p.caller,
                nftIndex: p.nftIndex,
                createdAt: p.createdAt
            })),
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
// Check if a specific address has presence for a specific event in series
router.get('/poap-serie/:seriesId/event/:eventId/address/:address', async (req, res) => {
    try {
        const { seriesId, eventId, address } = req.params;
        const presences = await models_1.PoapSerie.findAll({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId),
                caller: address
            },
            order: [['createdAt', 'DESC']]
        });
        res.json({
            hasPresence: presences.length > 0,
            count: presences.length,
            presences
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all events within a series that a specific address attended
router.get('/poap-serie/:seriesId/attendee/:address', async (req, res) => {
    try {
        const { seriesId, address } = req.params;
        const presences = await models_1.PoapSerie.findAll({
            where: {
                collectionContractId: seriesId,
                caller: address
            },
            attributes: [
                'eventId',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('eventId')), 'presenceCount'],
                [models_1.sequelize.fn('MIN', models_1.sequelize.col('createdAt')), 'firstAttendance'],
                [models_1.sequelize.fn('MAX', models_1.sequelize.col('createdAt')), 'lastAttendance']
            ],
            group: ['eventId'],
            order: [['eventId', 'ASC']]
        });
        res.json({
            seriesId,
            address,
            eventsAttended: presences.length,
            events: presences
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get presence statistics for all events in a series
router.get('/poap-serie/:seriesId/stats/events', async (req, res) => {
    try {
        const { seriesId } = req.params;
        const eventStats = await models_1.PoapSerie.findAll({
            where: {
                collectionContractId: seriesId
            },
            attributes: [
                'eventId',
                [models_1.sequelize.fn('COUNT', models_1.sequelize.col('*')), 'totalPresences'],
                [models_1.sequelize.fn('COUNT', models_1.sequelize.fn('DISTINCT', models_1.sequelize.col('caller'))), 'uniqueAttendees']
            ],
            group: ['eventId'],
            order: [['eventId', 'ASC']]
        });
        res.json({
            seriesId,
            totalEvents: eventStats.length,
            events: eventStats
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all presences by address across all events in a series (detailed view)
router.get('/poap-serie/:seriesId/address/:address/detailed', async (req, res) => {
    try {
        const { seriesId, address } = req.params;
        const presences = await models_1.PoapSerie.findAll({
            where: {
                collectionContractId: seriesId,
                caller: address
            },
            order: [['eventId', 'ASC'], ['createdAt', 'DESC']]
        });
        // Group by eventId
        const groupedByEvent = presences.reduce((acc, presence) => {
            const eventId = presence.eventId;
            if (!acc[eventId]) {
                acc[eventId] = [];
            }
            acc[eventId].push({
                contractId: presence.contractId,
                nftIndex: presence.nftIndex,
                isPublic: presence.isPublic,
                hasParticipated: presence.hasParticipated,
                createdAt: presence.createdAt
            });
            return acc;
        }, {});
        res.json({
            seriesId,
            address,
            totalPresences: presences.length,
            eventsAttended: Object.keys(groupedByEvent).length,
            presencesByEvent: groupedByEvent
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get validated/participated presences for a specific event in series
router.get('/poap-serie/:seriesId/event/:eventId/participated', async (req, res) => {
    try {
        const { seriesId, eventId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: presences } = await models_1.PoapSerie.findAndCountAll({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId),
                hasParticipated: true
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            presences,
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
// Get participation statistics for an event in series
router.get('/poap-serie/:seriesId/event/:eventId/participation-stats', async (req, res) => {
    try {
        const { seriesId, eventId } = req.params;
        const totalPresences = await models_1.PoapSerie.count({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId)
            }
        });
        const participatedCount = await models_1.PoapSerie.count({
            where: {
                collectionContractId: seriesId,
                eventId: parseInt(eventId),
                hasParticipated: true
            }
        });
        res.json({
            seriesId,
            eventId: parseInt(eventId),
            totalPresences,
            participatedCount,
            notParticipatedCount: totalPresences - participatedCount,
            participationRate: totalPresences > 0 ? (participatedCount / totalPresences) * 100 : 0
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get validated/participated presences for single event collection
router.get('/events/:collectionId/participated', async (req, res) => {
    try {
        const { collectionId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const { count, rows: presences } = await models_1.Poap.findAndCountAll({
            where: {
                collectionContractId: collectionId,
                hasParticipated: true
            },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            presences,
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
// Get participation statistics for single event collection
router.get('/events/:collectionId/participation-stats', async (req, res) => {
    try {
        const { collectionId } = req.params;
        const totalPresences = await models_1.Poap.count({
            where: {
                collectionContractId: collectionId
            }
        });
        const participatedCount = await models_1.Poap.count({
            where: {
                collectionContractId: collectionId,
                hasParticipated: true
            }
        });
        res.json({
            collectionId,
            totalPresences,
            participatedCount,
            notParticipatedCount: totalPresences - participatedCount,
            participationRate: totalPresences > 0 ? (participatedCount / totalPresences) * 100 : 0
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
