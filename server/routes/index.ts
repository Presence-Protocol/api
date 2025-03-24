import express from 'express';
import { Collection, Poap, sequelize } from '../models';

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
    const events = await Collection.findAll({where: {isPublic: true},order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 10 });
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

router.get('/stats/total', async (req, res) => {
  try {
    const totalCollections = await Collection.count();
    const totalPoaps = await Poap.count();
    
    res.json({
      totalCollections,
      totalPoaps
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 