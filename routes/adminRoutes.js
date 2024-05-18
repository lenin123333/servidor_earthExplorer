import express from 'express';
import { getData } from '../controllers/adminController.js';

const router = express.Router();

router.get('/',  getData);


export default router