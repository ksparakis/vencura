import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import {checkTransactionSchema} from '../schemas';
import {validatePath} from '../utils/zodValidators';
import {checkTransactionCompleted} from "../repos/cryptoTransactionsRepo";


const checkTransaction =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const { transactionId } = validatePath(event, checkTransactionSchema);
    // Cast to validated schema type
    const tx = await checkTransactionCompleted(transactionId)

    return response(200, {status: tx.status, message: tx.message});
}

export const handler = createHandler(checkTransaction);
