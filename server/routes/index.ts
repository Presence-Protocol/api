import express from 'express';
import { Collection, Poap } from '../models';

const router = express.Router();

router.get('/examples', async (req, res) => {
  try {
    const examples = await Collection.findAll();
    res.json(examples);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events/minted/:collectionid', async (req, res) => {
  try {
    console.log(req.params)

    const events = await Poap.findAll({where: {collectionContractId : req.params.collectionid}, order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 10 });
    res.json(events);
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
    const poaoMinterByUser = await Poap.findAll({where: {caller: req.params.address}, order: [ ['createdAt', 'DESC']], limit: parseInt(req.query.limit as string) || 20  })
    console.log(req.params)
    if (poaoMinterByUser) {
      res.json(poaoMinterByUser);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
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

export default router; 