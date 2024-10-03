import type {APIGatewayProxyEvent} from "aws-lambda";
import {ethers, HDNodeWallet, InfuraProvider} from "ethers";
import {getLogger} from "../middleware/logger";
import {getConfig} from "../utils/config";

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

export {
    getProvider,
    getBalance,
    getWallet
}
