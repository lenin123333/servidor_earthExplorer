import express from 'express';
import {
    updatePlayer,
    getPlayer
} from '../controllers/playerController.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

router.post('/', checkAuth, updatePlayer)
router.get('/', checkAuth, getPlayer)


export default router