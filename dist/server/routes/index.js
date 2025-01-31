"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const router = express_1.default.Router();
router.post('/examples', async (req, res) => {
    try {
        const example = await models_1.Collection.create(req.body);
        res.status(201).json(example);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/examples', async (req, res) => {
    try {
        const examples = await models_1.Collection.findAll();
        res.json(examples);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/examples/:id', async (req, res) => {
    try {
        const example = await models_1.Collection.findByPk(req.params.id);
        if (example) {
            res.json(example);
        }
        else {
            res.status(404).json({ error: 'Not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
