import express from 'express';
import {
    updatePlayer
} from '../controllers/playerController.js';
import checkAuth from '../middleware/checkAuth.js';
const router = express.Router();

router.put('/', checkAuth, updatePlayer)



export default router