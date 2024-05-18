import express from 'express';
import { getNotas } from '../controllers/noteChatGPTController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();


router.post('/',checkAuth, getNotas)




export default router