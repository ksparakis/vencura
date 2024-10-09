import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import { getLogger } from '../middleware/logger';
import {getProvider} from "../repos/walletUtil";


const processTransactionQueue =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    logger.debug('sendTransaction handler called', {event: JSON.stringify(event)});
    // Cast to validated schema type
   // const { password, amount, toAddress } = validateBody(event, passwordSchema);
    //const provider = getProvider();

    // const tx = {
    //     to: '0xRecipientAddressHere',
    //     value: parseEther('0.1'), // Amount to send (in ETH)
    //     gasLimit: ethers.utils.hexlify(21000), // Set gas limit
    //     gasPrice: await provider.getGasPrice(), // Gas price from network
    //     nonce: await wallet.getTransactionCount('latest') // Fetch nonce
    // };
    // await enqueueMessage(tx)
    return response(200, {});
}

export const handler = createHandler(processTransactionQueue);
