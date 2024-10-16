'use client';
import { useState, useEffect } from 'react';
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import './Methods.css';
import {getBalance, getOrCreateUser} from '../repo/vencuraBackendRepo';
import PasswordPrompt from './PasswordPrompt';
import WalletInfo from '@/app/components/WalletInfoComponent';
import SignMessage from '@/app/components/SignMessage';
import SendCryptoComponent from '@/app/components/SendCryptoComponent';
export default function MainComponent() {
    const isLoggedIn = useIsLoggedIn();
    const { sdkHasLoaded } = useDynamicContext();
    const [isLoading, setIsLoading] = useState(true);
    const [usersData, setUsersData ] = useState([]);
    const [balance, setBalance] = useState(0);
    const [passwordError, setPasswordError] = useState(null); // Track password error
    const [password, setPassword] = useState(''); // Track password
    const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false); // Track if password has been submitted


    useEffect(() => {
    }, [sdkHasLoaded, isLoggedIn, isPasswordSubmitted, password]);

    function handlePasswordSubmit(submittedPassword) {
        setPasswordError(null);
        getOrCreateUser(submittedPassword).then((user) => {
            console.log(user)
            setUsersData(user);
            setIsLoading(false);
            getBalance().then((balance) => {
                setBalance(balance.balance);
            });
            setPassword(submittedPassword);
            setIsPasswordSubmitted(true); // Mark password as submitted
        }).catch((error) => {
            console.error('Error getting user:', error);
            setPasswordError('Invalid password. Please try again.');
            setIsLoading(false);
        });
    }

    async function updateWallet(){
        const balance= await getBalance();
        setBalance(balance.balance);
    }


    return (
        <>
            {!isLoggedIn && <div>Please log in to continue.</div>}

            {isLoggedIn && !isPasswordSubmitted && (
                <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} passwordError={passwordError} />
            )}

            {!isLoading && isLoggedIn && isPasswordSubmitted && (
                <div>
                    <WalletInfo walletAddress={usersData.address} balance={balance} refreshBalance={updateWallet} />
                    <SignMessage password={password} />
                    <SendCryptoComponent balance={usersData.balance} password={password} refreshBalance={updateWallet}/>
                </div>
            )}
        </>
    );
}
