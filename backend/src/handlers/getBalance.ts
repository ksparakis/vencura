import middy from '@middy/core'
import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {ethers} from 'ethers';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import {getProvider, getWallet} from '../utils/walletUtil';
import {response} from '../utils/response';

const getBalance = async (req: APIGatewayProxyEvent, context: Context) => {
    const walletAddress = getWallet(req)
    if (!walletAddress) {
        return response(400, { message: 'Wallet address not found in token' });
    }

    try {
        // Get the balance
        const provider = getProvider();
        const balanceWei = await provider.getBalance(walletAddress);
        const balanceEther = ethers.formatEther(balanceWei);
        return response(200, { balance: balanceEther });
    } catch (err: any) {
        return response(500, { error: err });
    }
}

export const handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>()
    .use(httpSecurityHeaders())
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .handler(getBalance);
