import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {getUserBySub} from "../repos/userRepo";
import {getLogger} from "../middleware/logger";
import {getClaims} from "../utils/common";

const getUser =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { sub } = getClaims(event);
    logger.debug('getUser handler called', {event: event.requestContext.authorizer});
    const user= await getUserBySub(sub);
    return response(200, {user});
}


export const handler = createHandler(getUser);
