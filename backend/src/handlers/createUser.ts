import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import {ethers} from 'ethers';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import {response} from '../utils/response';
import {middleware} from "../utils/middleware";
import {loggerMiddleware} from "../utils/logger";
import httpErrorHandler from "@middy/http-error-handler";
import { generateMnemonic } from 'bip39';
import {zodValidator} from "../utils/zodMiddleware";
import {createUserSchema} from "../schemas";

const createUser = async (req: APIGatewayProxyEvent, context: Context) => {
    const { password }= req.body
    const mnemonic = generateMnemonic()
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    const signed = await wallet.signMessage("Hello World")
    return response(200, {wallet, signed});
}

export const handler = middleware(createUser)
    .use(httpErrorHandler())
    .use(loggerMiddleware())
    .use(httpSecurityHeaders())
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(zodValidator(createUserSchema));
