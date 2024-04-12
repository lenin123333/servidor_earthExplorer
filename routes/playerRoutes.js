import express from 'express';
import {
    updatePlayer,
    getPlayer
} from '../controllers/playerController.js';
import checkAuth from '../middleware/checkAuth.js';
import { stadistPlayer } from '../controllers/noteChatGPTController.js';
const router = express.Router();

router.post('/', checkAuth, updatePlayer)
router.get('/', checkAuth, getPlayer)
router.post('/stadist',stadistPlayer)


export default router