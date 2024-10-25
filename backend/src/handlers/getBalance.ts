import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { response } from '../utils/response';
import { createHandler } from '../middleware/middleware';
import {getUserBySub, getUsersWalletAddress} from "../repos/userRepo";
import { getBalance, getProvider } from "../repos/walletUtil";
import {getClaims} from "../utils/common";


const getBalanceRequest =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const { sub } = getClaims(event)
    const user = await getUserBySub(sub);

    try {
        // Get the balance
        const provider = getProvider(user.selectedNetwork);
        const balance = await getBalance(provider, user.address);
        return response(200, { balance });
    } catch (err: any) {
        return response(500, { error: err });
    }
}

export const handler = createHandler(getBalanceRequest);
