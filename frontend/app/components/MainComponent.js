'use client';
import { useState, useEffect } from 'react';
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import './Methods.css';
import { getOrCreateUser } from '../repo/vencuraBackendRepo';
import PasswordPrompt from './PasswordPrompt';
import WalletInfo from '@/app/components/WalletInfoComponent';
import SignMessage from '@/app/components/SignMessage';
import SendCryptoComponent from '@/app/components/SendCryptoComponent';
export default function MainComponent() {
    const isLoggedIn = useIsLoggedIn();
    const { sdkHasLoaded } = useDynamicContext();
    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData ] = useState([]);
    const [password, setPassword] = useState(''); // Track password
    const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false); // Track if password has been submitted


    useEffect(() => {
        if (sdkHasLoaded && isLoggedIn && isPasswordSubmitted) {
            getOrCreateUser(password).then((user) => {
                console.log(user)
                setUsersData(user);
                setIsLoading(false);
            });
        }
    }, [sdkHasLoaded, isLoggedIn, isPasswordSubmitted, password]);

    function handlePasswordSubmit(submittedPassword) {
        setPassword(submittedPassword);
        setIsPasswordSubmitted(true); // Mark password as submitted
    }


    return (
        <>
            {!isLoggedIn && <div>Please log in to continue.</div>}

            {isLoggedIn && !isPasswordSubmitted && (
                <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />
            )}

            {!isLoading && isLoggedIn && isPasswordSubmitted && (
                <div>
                    <WalletInfo walletAddress={usersData.address} balance={usersData.balance} />
                    <SignMessage password={password} />
                    <SendCryptoComponent balance={usersData.balance} password={password} />
                </div>
            )}
        </>
    );
}
