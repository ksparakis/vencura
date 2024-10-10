import React, { useState, useEffect } from 'react';
import './SendCryptoComponent.css';
import {checkTransaction, getOtherUsers, sendTransaction} from '@/app/repo/vencuraBackendRepo'; // Optional CSS file for styling



export default function SendCryptoComponent({ balance, password, refreshBalance }) {
    const [amount, setAmount] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [recipients, setRecipients] = useState([]);
    const [status, setStatus] = useState(null);
    const [completionMessage, setCompletionMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getOtherUsers().then((users) => {
            setRecipients(users.items);
        });
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (amount > balance) {
            setError('Amount exceeds balance.');
            return;
        }
        if (!selectedRecipient) {
            setError('Please select a recipient.');
            return;
        }

        setError(null);
        setIsLoading(true);

        // Send the transaction
        try {
            const transactionId = await sendTransaction(password, amount, selectedRecipient);
            setTransactionId(transactionId);

            // Poll for the transaction status every 10 seconds
            const intervalId = setInterval(async () => {
                const tx = await checkTransaction(transactionId);
                if (tx.status === 'succeeded' || tx.status === 'failed') {
                    setStatus(tx.status);
                    setCompletionMessage(tx.message);
                    setIsLoading(false);
                    refreshBalance();
                    clearInterval(intervalId); // Stop polling once resolved
                }
            }, 10000);
        } catch (err) {
            console.error('Error sending transaction:', err);
            setError('Failed to send transaction.');
            setIsLoading(false);
        }
    };

    const handleNewTransaction = () => {
        setAmount('');
        setSelectedRecipient('');
        setTransactionId(null);
        setStatus(null);
        setError(null);
    };

    return (
        <div className="transaction-container">
            {!transactionId ? (
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="amount">Enter Amount (Balance: {balance}):</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={balance}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="recipient">Select Recipient:</label>
                        <select
                            id="recipient"
                            value={selectedRecipient}
                            onChange={(e) => setSelectedRecipient(e.target.value)}
                            required
                        >
                            <option value="">-- Select a Recipient --</option>
                            {recipients.map((recipient) => (
                                <option key={recipient.address} value={recipient.address}>
                                    {recipient.email} - {recipient.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn btn-primary">Send Transaction</button>
                </form>
            ) : (
                <div className="transaction-status">
                    {isLoading ? (
                        <>
                            <p>Waiting for transaction to complete...</p>
                            <div className="loader"></div> {/* CSS loader for animation */}
                        </>
                    ) : (
                        <>
                            <p>Transaction {status === 'succeeded' ? 'completed successfully!' : 'failed!'}</p>
                            <p></p>
                            <pre className="signed-message">{status === 'failed' ? completionMessage: ''}</pre>
                            <button className="btn btn-secondary" onClick={handleNewTransaction}>Send New Transaction
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
