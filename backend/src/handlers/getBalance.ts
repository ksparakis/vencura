import middy from '@middy/core'
import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {ethers} from 'ethers';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import {getBalance, getProvider, getWallet} from '../utils/walletUtil';
import {response} from '../utils/response';
import {middleware} from "../utils/middleware";
import {loggerMiddleware} from "../utils/logger";
import httpErrorHandler from "@middy/http-error-handler";
import {sequelizeMiddleware} from "../utils/sequelizeMiddleware";
import wrapper from "../utils/wrapper";

const getBalanceRequest = async (req: APIGatewayProxyEvent, context: Context) => {
    const walletAddress = ''
    if (!walletAddress) {
        return response(400, { message: 'Wallet address not found in token' });
    }

    try {
        // Get the balance
        const provider = getProvider();
        const balance = getBalance(provider, walletAddress);

        return response(200, { balance });
    } catch (err: any) {
        return response(500, { error: err });
    }
}

export const handler = wrapper(middleware(getBalanceRequest)

