import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API Controller function to get user available credits data
const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        res.json({ success: true, credits: user.creditBalance, user: { name: user.name } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Payment API to add credits using UPI
const paymentUPI = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        let credits, plan, amount, date;
        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;

            default:
                return res.json({ success: false, message: 'Plan not found' });
        }

        date = Date.now();

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date,
            paymentMethod: 'UPI',
            payment: false,
        };

        const newTransaction = await transactionModel.create(transactionData);

        const upiId = "9270071625@kotak811";

        res.json({
            success: true,
            message: "Please complete the payment using the provided UPI details.",
            transactionId: newTransaction._id,
            upiId,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API Controller function to verify UPI payment
const verifyUPI = async (req, res) => {
    try {
        const { transactionId, success } = req.body;

        if (!transactionId || typeof success === 'undefined') {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (success === true) {
            const transactionData = await transactionModel.findById(transactionId);

            if (!transactionData) {
                return res.json({ success: false, message: 'Transaction not found' });
            }

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Already Verified' });
            }

            const userData = await userModel.findById(transactionData.userId);
            const creditBalance = userData.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(userData._id, { creditBalance });

            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });
            res.json({ success: true, message: "Payment verified and credits added" });
        } else {
            res.json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, paymentUPI, registerUser, userCredits, verifyUPI };
