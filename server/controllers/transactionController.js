import PDFDocument from 'pdfkit';
import transactionModel from '../models/transactionModel.js';

// Controller to handle transaction history export
const exportTransactionHistory = async (req, res) => {
    try {
        const { id: userId } = req.user;

        // Fetch all transactions for the user
        const transactions = await transactionModel.find({ userId });

        if (transactions.length === 0) {
            return res.status(404).json({ success: false, message: 'No transactions found' });
        }

        // Create a new PDF document
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=transaction_history.pdf');

        // Add content to the PDF
        doc.text('Transaction History', { align: 'center', underline: true });
        doc.moveDown();

        transactions.forEach((transaction, index) => {
            doc.text(`Transaction ${index + 1}`);
            doc.text(`Plan: ${transaction.plan}`);
            doc.text(`Credits: ${transaction.credits}`);
            doc.text(`Amount: ₹${transaction.amount}`);
            doc.text(`Date: ${new Date(transaction.date).toLocaleString()}`);
            doc.text('---------------------------------------');
        });

        // End the PDF and send it as a response
        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error generating PDF' });
    }
};

export { exportTransactionHistory };
