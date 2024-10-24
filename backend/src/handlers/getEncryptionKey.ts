import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { createHandler } from '../middleware/middleware';
import { saveEncryptionPvtKey} from "../repos/userRepo";
import {getClaims} from "../utils/common";
import { createRSAKeyPair } from '../utils/crypto';
import {response} from "../utils/response";


const getEncryptionKey =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const { sub } = getClaims(event);
    const { privateKey, publicKey } = await createRSAKeyPair();
    await saveEncryptionPvtKey(sub, privateKey);
    return response(200, { publicKey });
}

export const handler = createHandler(getEncryptionKey);
