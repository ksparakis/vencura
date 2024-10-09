import React from 'react';
import './WalletInfo.css';


export default function WalletInfo({ walletAddress, balance }) {
    return (
        <div className="wallet-info-container">
            <div className="wallet-info">
                <div className="wallet-address">
                    <label>Wallet Address:</label>
                    <span>{walletAddress}</span>
                </div>
                <div className="wallet-balance">
                    <label>Balance:</label>
                    <span>{balance}</span>
                </div>
            </div>
        </div>
    );
}
