import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {retrieveAllUsersExcludingSub} from "../repos/userRepo";
import {getLogger} from "../middleware/logger";
import {getClaims} from "../utils/common";

const getAllOtherUsers =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    logger.debug('claims', {claims: JSON.stringify(event.requestContext)});
    const { sub } =  getClaims(event)
    logger.debug('userid', {sub});
    const users = await retrieveAllUsersExcludingSub(sub);
    return response(200, {items: users});
}

export const handler = createHandler(getAllOtherUsers);
