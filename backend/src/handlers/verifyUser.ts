import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {response} from "../utils/response";
import {createHandler} from "../middleware/middleware";
import {getUserBySub} from "../repos/userRepo";
import {getLogger} from "../middleware/logger";
import {getClaims} from "../utils/common";
import {validateBody} from "../utils/zodValidators";
import {passwordSchema} from "../schemas";
import {decrypt, rsaDecrypt} from "../utils/crypto";

const verifyUser =   async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { sub } = getClaims(event);
    const { password } = validateBody(event, passwordSchema);

    logger.debug('getUser handler called', {event: event.requestContext.authorizer});
    const user= await getUserBySub(sub);
    if(!user.passwordEncryptionPvtKey) {
        return response(400, {message: 'Must call get encryption first'});
    }
    const decryptedPassword = await rsaDecrypt(user.passwordEncryptionPvtKey, password);
    decrypt(user.encryptedMnemonic, decryptedPassword, sub);
    delete user.passwordEncryptionPvtKey;

    return response(200, {user});
}


export const handler = createHandler(verifyUser);
