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

router.get('/poap/:address', async (req, res) => {
  try {
    const poaoMinterByUser = await Poap.findAll({where: {caller: req.params.address}, order: [ ['createdAt', 'DESC']] })
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