import type { APIGatewayProxyResult, SQSEvent } from 'aws-lambda'
import { response } from '../utils/response';
import { createSQSHandler } from '../middleware/middleware';
import { getLogger } from '../middleware/logger';
import { validateSQSBody } from "../utils/zodValidators";
import { processTransactionSchema } from "../schemas";
import { parseEther } from "ethers";
import { getWalletForUser } from "../utils/common";
import { updateTransactionStatus } from "../repos/cryptoTransactionsRepo";


const processTransactionQueue =   async (
    event: SQSEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { id, sub, to, amount, password} = validateSQSBody(event, processTransactionSchema).payload;
    logger.debug('sendTransaction handler called', {event: JSON.stringify(event)});
    const wallet = await getWalletForUser(sub, password);

    const tx = {
        to, // The recipient address, passed in the body
        value: parseEther(amount), // Convert the amount to wei (ether)
    };



    // Step 5: Wait for the transaction to be mined
    try {
        // Step 4: Send the transaction
        const transactionResponse = await wallet.sendTransaction(tx);
        logger.info('Transaction sent:', transactionResponse.hash);

        const receipt = await transactionResponse.wait();
        logger.info('Transaction mined:', receipt);

        if (!receipt || receipt.status === 0) {
            await updateTransactionStatus(id, 'failed', 'Transaction failed');
        } else {
            await updateTransactionStatus(id, 'succeeded', 'Transaction succeeded');
        }
    } catch (error: any) {
        logger.error('Transaction failed:', error.message);
        await updateTransactionStatus(id, 'failed', error.message);
    }

    return response(200, {});
}


export const handler = createSQSHandler(processTransactionQueue);
