import {ethers, HDNodeWallet, InfuraProvider, TransactionRequest, TransactionResponse} from "ethers";
import {getLogger} from "../middleware/logger";
import {getConfig} from "../utils/config";
import createHttpError from "http-errors";

function getProvider(): InfuraProvider{
    const config = getConfig();
    return new ethers.InfuraProvider(
        config.INFURA_NETWORK,
        config.INFURA_PROJECT_ID,
        config.INFURA_SECRET
    )
}

async function getBalance(provider: ethers.InfuraProvider, walletAddress: string): Promise<string>{
    const balanceWei = await provider.getBalance(walletAddress);
    return ethers.formatEther(balanceWei);
}


function getWallet(mnemonic: string): HDNodeWallet {
    const logger = getLogger();
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    if (!wallet.address) {
        logger.error('No wallet address found', {wallet});
        throw new Error('No wallet address found');
    }
    return wallet;
}

// Step 4: Send the transaction
async function sendTransaction(wallet: HDNodeWallet, tx: TransactionRequest): Promise<TransactionResponse> {
    try {
        const transaction = await wallet.sendTransaction(tx);
        await transaction.wait(); // Wait for the transaction to be mined
        return transaction;
    } catch (error: any) {
        throw createHttpError(500, error.message);
    }
}

export {
    getProvider,
    getBalance,
    getWallet
}
