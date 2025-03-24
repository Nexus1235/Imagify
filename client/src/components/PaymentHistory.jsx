import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const PaymentHistory = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch transaction history
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/transactions`, {
                    headers: { token },
                });

                if (data.success) {
                    setTransactions(data.transactions);
                } else {
                    console.error('Failed to fetch transactions');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [backendUrl, token]);

    // Download transaction history PDF
    const downloadTransactionHistory = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/transactions/export`, {
                headers: { token },
                responseType: 'blob', // Treat response as a file
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transaction_history.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error('Error downloading transaction history:', error);
        }
    };

    return (
        <div className="min-h-[80vh] text-center pt-14 mb-10">
            <h1 className="text-3xl font-medium mb-6">Payment History</h1>

            {/* Loading state */}
            {loading ? (
                <p>Loading transactions...</p>
            ) : transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 border">Plan</th>
                            <th className="p-3 border">Credits</th>
                            <th className="p-3 border">Amount</th>
                            <th className="p-3 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn, index) => (
                            <tr key={index} className="border">
                                <td className="p-3 border">{txn.plan}</td>
                                <td className="p-3 border">{txn.credits}</td>
                                <td className="p-3 border">₹{txn.amount}</td>
                                <td className="p-3 border">{new Date(txn.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Download Button */}
            <button
                onClick={downloadTransactionHistory}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
            >
                Download Transaction History
            </button>
        </div>
    );
};

export default PaymentHistory;
