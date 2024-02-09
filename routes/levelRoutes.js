import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addLevel,getLevels } from '../controllers/levelController.js';
const router = express.Router();

router.post('/', checkAuth, addLevel)
router.get('/', checkAuth, getLevels)


export default router