import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import { createHandler } from '../middleware/middleware';
import { getUsersWalletAddress } from "../repos/userRepo";
import { getBalance, getProvider } from "../repos/walletUtil";


const getBalanceRequest =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
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
