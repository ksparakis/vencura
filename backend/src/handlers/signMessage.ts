import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import { signMessageSchema} from '../schemas';
import {validateBody} from '../utils/zodValidators';
import {getLogger} from '../middleware/logger';

import {getWalletForUser} from "../utils/common";


const signMessage =   async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    // Cast to validated schema type
    const { password, message } = validateBody(event, signMessageSchema);
    const wallet = await getWalletForUser(event.requestContext.authorizer?.claims?.sub, password);
    const signedMessage = await wallet.signMessage(message);

    return response(200, {signedMessage});
}

export const handler = createHandler(signMessage);
