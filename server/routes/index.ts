import express from 'express';
import { Collection, Series, PoapSerie, Poap, sequelize } from '../models';

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
    const events = await Collection.findAll({where: {isPublic: true, disabled: false},order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 10 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { unique } = req.query;

    let poaps;
    if (unique === 'true') {
      poaps = await Poap.findAll({
        where: { caller: address },
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
        where: { caller: address },
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
    const collectionMinterByUser = await Collection.findAll({where: {caller: req.params.address}, order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 20  })
    console.log(req.params)
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

// New endpoints for Series
router.get('/series', async (req, res) => {
  try {
    const series = await Series.findAll({
      where: { isPublic: true },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 10
    });
    res.json(series);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/series/:collectionId', async (req, res) => {
  try {
    const series = await Series.findAll({
      where: { collectionContractId: req.params.collectionId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });
    res.json(series);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/series/organizer/:address', async (req, res) => {
  try {
    const series = await Series.findAll({
      where: { organizer: req.params.address },
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit as string) || 20
    });
    res.json(series);
  } catch (error: any) {
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
      poapSeries = await PoapSerie.findAll({
        where: { caller: address },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('collectionContractId')), 'collectionContractId'],
          'contractId',
          'eventId',
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
      poapSeries = await PoapSerie.findAll({
        where: { caller: address },
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
      where: { collectionContractId: req.params.seriesId },
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Updated stats endpoint
router.get('/stats/total', async (req, res) => {
  try {
    const totalCollections = await Collection.count();
    const totalSeries = await Series.count();
    const totalPoaps = await Poap.count();
    const totalPoapSeries = await PoapSerie.count();
    
    res.json({
      totalCollections,
      totalSeries,
      totalPoaps,
      totalPoapSeries
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// New stats endpoints
router.get('/series/stats/totaladdresses', async (req, res) => {
  try {
    const seriesCounts = await Series.findAll({
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

export default router; 