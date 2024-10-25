import React, { useState } from 'react';
import './NetworkSelector.css';
import {changeNetwork} from '@/app/repo/vencuraBackendRepo'; // Include the CSS file

export default function NetworkSelector({ refreshBalance, network }) {
    const [selectedNetwork, setSelectedNetwork] = useState(network);

    async function handleNetworkChange(event) {
        const network = event.target.value;
        try {
            changeNetwork(event.target.value).then(()=>{
                setSelectedNetwork(network);
                refreshBalance();
            }).catch(()=>{
                alert('Failed to change network');
            })


        } catch (error) {
            console.error(`Failed to change network: ${error}`);
        }
    }

    return (
        <div className="network-selector-container">
            <label htmlFor="network-selector">Select Network: </label>
            <select
                id="network-selector"
                className="network-selector"
                value={selectedNetwork}
                onChange={handleNetworkChange}
            >
                <option value="sepolia">Sepolia</option>
                <option value="matic-amoy">Polygon Test</option>
            </select>
        </div>
    );
}
