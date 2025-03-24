import express from 'express';
import {
    loginUser,
    paymentUPI,
    registerUser,
    userCredits,
    verifyUPI,
} from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', authUser, userCredits);
userRouter.post('/pay-upi', authUser, paymentUPI);
userRouter.post('/verify-upi', authUser, verifyUPI);

export default userRouter;
