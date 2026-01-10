import express from 'express';
import { Collection, SeriesCollection, SeriesEvent, PoapSerie, Poap, sequelize } from '../models';

const router = express.Router();

router.get('/events/minted/:collectionid', async (req, res) => {
  try {
    console.log(req.params)

    const events = await Poap.findAll({where: {collectionContractId : req.params.collectionid}, order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 10 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/events/minted-list/:collectionid', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const { count, rows: events } = await Poap.findAndCountAll({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { type, all } = req.query;
    const limit = all === 'true' ? undefined : (parseInt(req.query.limit as string) || 10);

    // Filter by type: 'single' for single events only, 'series' for series events only
    // Default: return both single events and series events combined
    if (type === 'single') {
      const events = await Collection.findAll({
        where: { isPublic: true, disabled: false },
        order: [['createdAt', 'DESC']],
        ...(limit && { limit })
      });
      res.json(events);
    } else if (type === 'series') {
      const seriesEvents = await SeriesEvent.findAll({
        where: { isPublic: true },
        order: [['createdAt', 'DESC']],
        ...(limit && { limit })
      });
      res.json(seriesEvents);
    } else {
      // Default: return both single events and series events
      const [singleEvents, seriesEvents] = await Promise.all([
        Collection.findAll({
          where: { isPublic: true, disabled: false },
          order: [['createdAt', 'DESC']]
        }),
        SeriesEvent.findAll({
          where: { isPublic: true },
          order: [['createdAt', 'DESC']]
        })
      ]);

      // Combine and sort by createdAt
      let allEvents = [
        ...singleEvents.map(e => ({ ...e.toJSON(), eventType: 'single' })),
        ...seriesEvents.map(e => ({ ...e.toJSON(), eventType: 'series' }))
      ].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      // Apply limit if not requesting all
      if (limit) {
        allEvents = allEvents.slice(0, limit);
      }

      res.json(allEvents);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { unique } = req.query;
    const { Op } = require('sequelize');

    const whereClause = {
      caller: {
        [Op.like]: `${address}%`
      }
    };

    let poaps;
    if (unique === 'true') {
      poaps = await Poap.findAll({
        where: whereClause,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('collectionContractId')), 'collectionContractId'],
          'contractId',
          'nftIndex',
          'caller',
          'isPublic',
          'createdAt',
          [sequelize.fn('COUNT', sequelize.col('collectionContractId')), 'count']
        ],
        group: ['collectionContractId'],
        order: [['createdAt', 'DESC']]
      });
    } else {
      poaps = await Poap.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });
    }

    res.json(poaps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const { Op } = require('sequelize');

    const collectionMinterByUser = await Collection.findAll({
      where: {
        caller: {
          [Op.like]: `${address}%`
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });

    if (collectionMinterByUser) {
      res.json(collectionMinterByUser);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events/stats/totaladdresses', async (req, res) => {
  try {
    const eventCounts = await Collection.findAll({
      attributes: [
        'caller',
        [sequelize.fn('COUNT', sequelize.col('*')), 'eventCount']
      ],
      group: ['caller'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });

    if (eventCounts) {
      res.json(eventCounts);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/poap/stats/totaladdresses', async (req, res) => {
  try {
    const eventCounts = await Poap.findAll({
      attributes: [
        'caller',
        [sequelize.fn('COUNT', sequelize.col('*')), 'eventCount']
      ],
      group: ['caller'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });

    if (eventCounts) {
      res.json(eventCounts);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoints for Series
// Get all series collections
router.get('/series', async (req, res) => {
  try {
    const seriesCollections = await SeriesCollection.findAll({
      where: { isPublic: true, disabled: false },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 10
    });
    res.json(seriesCollections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get series collections by organizer
router.get('/series/organizer/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const { Op } = require('sequelize');

    const seriesCollections = await SeriesCollection.findAll({
      where: {
        caller: {
          [Op.like]: `${address}%`
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });
    res.json(seriesCollections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get individual events added by a specific organizer within series
router.get('/series/events/organizer/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const { Op } = require('sequelize');

    const seriesEvents = await SeriesEvent.findAll({
      where: {
        organizer: {
          [Op.like]: `${address}%`
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });
    res.json(seriesEvents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events within a specific series collection
router.get('/series/:seriesId/events', async (req, res) => {
  try {
    const events = await SeriesEvent.findAll({
      where: { seriesContractId: req.params.seriesId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get series collection details by ID (must come after more specific routes)
router.get('/series/:seriesId', async (req, res) => {
  try {
    const seriesCollection = await SeriesCollection.findOne({
      where: { contractId: req.params.seriesId }
    });

    if (!seriesCollection) {
      res.status(404).json({ error: 'Series collection not found' });
    } else {
      // Also get the events in this series
      const events = await SeriesEvent.findAll({
        where: { seriesContractId: req.params.seriesId },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        ...seriesCollection.toJSON(),
        eventsCount: events.length,
        events
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoints for PoapSerie
router.get('/poap-serie/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { unique } = req.query;
    const { Op } = require('sequelize');

    const whereClause = {
      caller: {
        [Op.like]: `${address}%`
      }
    };

    let poapSeries;
    if (unique === 'true') {
      poapSeries = await PoapSerie.findAll({
        where: whereClause,
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('seriesContractId')), 'seriesContractId'],
          'contractId',
          'eventId',
          'nftIndex',
          'caller',
          'isPublic',
          'createdAt',
          [sequelize.fn('COUNT', sequelize.col('seriesContractId')), 'count']
        ],
        group: ['seriesContractId'],
        order: [['createdAt', 'DESC']]
      });
    } else {
      poapSeries = await PoapSerie.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
      });
    }

    res.json(poapSeries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap-serie/minted/:seriesId', async (req, res) => {
  try {
    const poapSeries = await PoapSerie.findAll({
      where: { seriesContractId: req.params.seriesId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 10
    });
    res.json(poapSeries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap-serie/minted-list/:seriesId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;

    const { count, rows: poapSeries } = await PoapSerie.findAndCountAll({
      where: { seriesContractId: req.params.seriesId },
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Updated stats endpoint
router.get('/stats/total', async (req, res) => {
  try {
    const totalEvents = await Collection.count();
    const totalSeriesCollections = await SeriesCollection.count();
    const totalSeriesEvents = await SeriesEvent.count();
    const totalPoaps = await Poap.count();
    const totalPoapSeries = await PoapSerie.count();

    res.json({
      totalEvents,
      totalSeriesCollections,
      totalSeriesEvents,
      totalPoaps,
      totalPoapSeries
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Stats endpoints
router.get('/series/stats/totaladdresses', async (req, res) => {
  try {
    const seriesCounts = await SeriesEvent.findAll({
      attributes: [
        'organizer',
        [sequelize.fn('COUNT', sequelize.col('*')), 'seriesCount']
      ],
      group: ['organizer'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });

    res.json(seriesCounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap-serie/stats/totaladdresses', async (req, res) => {
  try {
    const poapSerieCounts = await PoapSerie.findAll({
      attributes: [
        'caller',
        [sequelize.fn('COUNT', sequelize.col('*')), 'poapSerieCount']
      ],
      group: ['caller'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });

    res.json(poapSerieCounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// New routes for multiple presences per event in series

// Get all presences for a specific event within a series
router.get('/poap-serie/:seriesId/event/:eventId', async (req, res) => {
  try {
    const { seriesId, eventId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const { count, rows: presences } = await PoapSerie.findAndCountAll({
      where: {
        seriesContractId: seriesId,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get list of addresses that attended a specific event in a series
router.get('/poap-serie/:seriesId/event/:eventId/addresses', async (req, res) => {
  try {
    const { seriesId, eventId } = req.params;
    const limit = parseInt(req.query.limit as string) || 1000;
    const offset = parseInt(req.query.offset as string) || 0;

    const { count, rows: presences } = await PoapSerie.findAndCountAll({
      where: {
        seriesContractId: seriesId,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check if a specific address has presence for a specific event in series
router.get('/poap-serie/:seriesId/event/:eventId/address/:address', async (req, res) => {
  try {
    const { seriesId, eventId, address } = req.params;
    const { Op } = require('sequelize');

    const presences = await PoapSerie.findAll({
      where: {
        seriesContractId: seriesId,
        eventId: parseInt(eventId),
        caller: {
          [Op.like]: `${address}%`
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      hasPresence: presences.length > 0,
      count: presences.length,
      presences
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events within a series that a specific address attended
router.get('/poap-serie/:seriesId/attendee/:address', async (req, res) => {
  try {
    const { seriesId, address } = req.params;
    const { Op } = require('sequelize');

    const presences = await PoapSerie.findAll({
      where: {
        seriesContractId: seriesId,
        caller: {
          [Op.like]: `${address}%`
        }
      },
      attributes: [
        'eventId',
        [sequelize.fn('COUNT', sequelize.col('eventId')), 'presenceCount'],
        [sequelize.fn('MIN', sequelize.col('createdAt')), 'firstAttendance'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastAttendance']
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get presence statistics for all events in a series
router.get('/poap-serie/:seriesId/stats/events', async (req, res) => {
  try {
    const { seriesId } = req.params;

    const eventStats = await PoapSerie.findAll({
      where: {
        seriesContractId: seriesId
      },
      attributes: [
        'eventId',
        [sequelize.fn('COUNT', sequelize.col('*')), 'totalPresences'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('caller'))), 'uniqueAttendees']
      ],
      group: ['eventId'],
      order: [['eventId', 'ASC']]
    });

    res.json({
      seriesId,
      totalEvents: eventStats.length,
      events: eventStats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all presences by address across all events in a series (detailed view)
router.get('/poap-serie/:seriesId/address/:address/detailed', async (req, res) => {
  try {
    const { seriesId, address } = req.params;
    const { Op } = require('sequelize');

    const presences = await PoapSerie.findAll({
      where: {
        seriesContractId: seriesId,
        caller: {
          [Op.like]: `${address}%`
        }
      },
      order: [['eventId', 'ASC'], ['createdAt', 'DESC']]
    });

    // Group by eventId
    const groupedByEvent = presences.reduce((acc: any, presence: any) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get validated/participated presences for a specific event in series
router.get('/poap-serie/:seriesId/event/:eventId/participated', async (req, res) => {
  try {
    const { seriesId, eventId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const { count, rows: presences } = await PoapSerie.findAndCountAll({
      where: {
        seriesContractId: seriesId,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get participation statistics for an event in series
router.get('/poap-serie/:seriesId/event/:eventId/participation-stats', async (req, res) => {
  try {
    const { seriesId, eventId } = req.params;

    const totalPresences = await PoapSerie.count({
      where: {
        seriesContractId: seriesId,
        eventId: parseInt(eventId)
      }
    });

    const participatedCount = await PoapSerie.count({
      where: {
        seriesContractId: seriesId,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get validated/participated presences for single event collection
router.get('/events/:collectionId/participated', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const { count, rows: presences } = await Poap.findAndCountAll({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get participation statistics for single event collection
router.get('/events/:collectionId/participation-stats', async (req, res) => {
  try {
    const { collectionId } = req.params;

    const totalPresences = await Poap.count({
      where: {
        collectionContractId: collectionId
      }
    });

    const participatedCount = await Poap.count({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 