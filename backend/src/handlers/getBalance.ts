import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import { createHandler } from '../middleware/middleware';
import { getLogger } from '../middleware/logger';
import { getUsersWalletAddress } from "../repo/userRepo";
import { getBalance, getProvider, getWallet } from "../repo/walletUtil";


const getBalanceRequest =   async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    // Cast to validated schema type

    const address = await getUsersWalletAddress(
        event.requestContext.authorizer?.claims?.sub,
    );

    try {
        // Get the balance
        const provider = getProvider();
        const balance = await getBalance(provider, address);

        return response(200, { balance });
    } catch (err: any) {
        return response(500, { error: err });
    }
}

export const handler = createHandler(getBalanceRequest);
