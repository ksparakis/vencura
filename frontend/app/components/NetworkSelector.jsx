import React, { useState } from 'react';
import './NetworkSelector.css';
import {changeNetwork} from '@/app/repo/vencuraBackendRepo'; // Include the CSS file

export default function NetworkSelector({}) {
    const [selectedNetwork, setSelectedNetwork] = useState('sepolia');

    async function handleNetworkChange(event) {


        try {
            await changeNetwork(network); // Call the async function to handle network change
            console.log(`Network successfully changed to: ${network}`);
            const network = event.target.value;
            setSelectedNetwork(network);
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
                <option value="polygon-test">Polygon Test</option>
            </select>
        </div>
    );
}
