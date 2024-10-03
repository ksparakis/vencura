import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {getUserBySub} from "../repo/userRepo";
import {User} from "../models/users";

const getUser =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const sub = event.requestContext.authorizer?.claims?.sub;
    const user= await getUserBySub(sub);
    return response(200, {user});
}


export const handler = createHandler(getUser);
