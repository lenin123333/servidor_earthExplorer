import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addLevel,getLevels, getStatistics } from '../controllers/levelController.js';
const router = express.Router();

router.post('/', checkAuth, addLevel)
router.get('/', checkAuth, getLevels)
router.get('/:id', getStatistics)



export default router