import express from 'express';
import { Collection, Poap } from '../models';

const router = express.Router();

router.post('/examples', async (req, res) => {
  try {
    const example = await Collection.create(req.body);
    res.status(201).json(example);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/examples', async (req, res) => {
  try {
    const examples = await Collection.findAll();
    res.json(examples);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/poap/:address', async (req, res) => {
  try {
    const poaoMinterByUser = await Poap.findAll({where: {caller: req.params.address} })
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

export default router; 