import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const BuyCredit = () => {
  const { backendUrl, loadCreditsData, user, token, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const handlePaymentUPI = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }

      // Initiate UPI payment via backend
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-upi`,
        { planId },
        { headers: { token } }
      );

      if (data.success) {
        // Inform the user about the UPI details to make the payment
        toast.info(`Complete your UPI payment using the following UPI ID: ${data.upiId}`);
        toast.info(`Transaction ID: ${data.transactionId}`);

        // Poll for payment verification or ask the user to manually confirm
        const checkPayment = async () => {
          const verificationResponse = await axios.post(
            `${backendUrl}/api/user/verify-upi`,
            { transactionId: data.transactionId, success: true }, // Change `success` based on user confirmation
            { headers: { token } }
          );

          if (verificationResponse.data.success) {
            loadCreditsData();
            navigate('/');
            toast.success('Credits added successfully!');
          } else {
            toast.error('Payment verification failed. Please try again.');
          }
        };

        // Simulate a delay before verifying the payment
        setTimeout(() => {
          checkPayment();
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to initiate UPI payment.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred while processing your payment.');
    }
  };

  return (
    <motion.div
      className="min-h-[80vh] text-center pt-14 mb-10"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">Our Plans</button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">Choose the plan</h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">₹{item.price}</span>/ {item.credits} credits
            </p>
            <div className="flex flex-col mt-4">
              <button
                onClick={() => handlePaymentUPI(item.id)}
                className="w-full flex justify-center gap-2 border border-gray-400 mt-2 text-sm rounded-md py-2.5 min-w-52 hover:bg-blue-50 hover:border-blue-400"
              >
                <img className="h-4" src={assets.upi} alt="UPI Logo" />
                Pay with UPI
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
