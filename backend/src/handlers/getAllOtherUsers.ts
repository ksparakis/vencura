import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {retrieveAllUsersExcludingSub} from "../repo/userRepo";

const getAllOtherUsers =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const sub = event.requestContext.authorizer?.claims?.sub;
    const users = await retrieveAllUsersExcludingSub(sub);
    return response(200, {items: users});
}

export const handler = createHandler(getAllOtherUsers);
