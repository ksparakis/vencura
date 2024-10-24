import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { createHandler } from '../middleware/middleware';
import {updateSelectedNetwork} from "../repos/userRepo";
import {getClaims} from "../utils/common";
import {response} from "../utils/response";
import {validateBody} from "../utils/zodValidators";
import {changeNetworkSchema} from "../schemas";


const changeNetwork =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const { sub } = getClaims(event);
    const {network}  = validateBody(event, changeNetworkSchema);
    await updateSelectedNetwork(sub, network);
    return response(200, {});
}

export const handler = createHandler(changeNetwork);
