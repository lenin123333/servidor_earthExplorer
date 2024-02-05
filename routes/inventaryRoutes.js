import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addInventory,showinventary } from '../controllers/inventaryController.js';
const router = express.Router();

router.post('/', checkAuth, addInventory);
router.get('/', checkAuth, showinventary);


export default router