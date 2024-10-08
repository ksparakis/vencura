import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import { ethers } from 'ethers';
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import { generateMnemonic } from 'bip39';
import { passwordSchema } from '../schemas';
import {validateBody} from '../utils/zodValidators';
import {getLogger} from '../middleware/logger';
import {encrypt} from '../utils/crypto';
import {createNewUser} from "../repos/userRepo";


const createUser =   async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { password } = validateBody(event, passwordSchema);
    const mnemonic = generateMnemonic()
    const encryptedMnemonic = encrypt(mnemonic, password);
    logger.debug({encryptedMnemonic});
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    const newUser = await createNewUser(
        event.requestContext?.authorizer?.claims?.sub as string,
        event.requestContext.authorizer?.claims?.email,
        encryptedMnemonic,
        wallet.address,
        wallet.publicKey
    );


    return response(200, {newUser});
}

export const handler = createHandler(createUser);
