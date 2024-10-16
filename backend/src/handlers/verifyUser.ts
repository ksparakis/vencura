import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {getUserBySub} from "../repos/userRepo";
import {getLogger} from "../middleware/logger";
import {getClaims, getWalletForUser} from "../utils/common";
import {validateBody} from "../utils/zodValidators";
import {passwordSchema} from "../schemas";
import {decrypt} from "../utils/crypto";

const verifyUser =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { sub } = getClaims(event);
    const { password } = validateBody(event, passwordSchema);

    logger.debug('getUser handler called', {event: event.requestContext.authorizer});
    const user= await getUserBySub(sub);
    decrypt(user.encryptedMnemonic, password, sub);

    return response(200, {user});
}


export const handler = createHandler(verifyUser);
