import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { response } from '../utils/response';
import { createHandler } from '../middleware/middleware';
import { sendTransactionSchema } from '../schemas';
import { validateBody } from '../utils/zodValidators';
import { enqueueMessage } from "../repos/sqsRepo";
import {newTransaction} from "../repos/cryptoTransactionsRepo";
import {getLogger} from "../middleware/logger";


const sendTransaction =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger()
    logger.debug(JSON.stringify(event.body));
    const { password, amount, to } = validateBody(event, sendTransactionSchema);
    const tx = await newTransaction(event.requestContext.authorizer?.claims?.sub, to, amount)
    const msg = {...tx, password}
    await enqueueMessage(msg)
    return response(200, {transactionId: tx.id});
}

export const handler = createHandler(sendTransaction);
