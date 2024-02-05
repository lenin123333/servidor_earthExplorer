import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addLevel } from '../controllers/levelController.js';
const router = express.Router();

router.post('/', checkAuth, addLevel)



export default router