import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import { signMessageSchema} from '../schemas';
import {validateBody} from '../utils/zodValidators';

import {getClaims, getWalletForUser} from "../utils/common";


const signMessage =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    // Cast to validated schema type
    const { sub } = getClaims(event);
    const { password, message } = validateBody(event, signMessageSchema);
    const wallet = await getWalletForUser(sub, password);
    const signedMessage = await wallet.signMessage(message);

    return response(200, {signedMessage});
}

export const handler = createHandler(signMessage);
