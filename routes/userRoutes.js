import express from 'express';
import {
    register,
    confirm,
    authenticate,
    forgotPassword,
    newPassword,
    verifyToken,
    loginGoogle,
    loginGuest
} from '../controllers/userController.js';




const router = express.Router();



router.post('/',register)
router.post('/login-google',loginGoogle)
router.get('/login-guest',loginGuest)
router.post('/confirm',confirm)
router.post('/login',authenticate)
router.post('/forgot-password',forgotPassword)
router.post('/validate-token', verifyToken)
router.post('/new-password',newPassword)



export default router