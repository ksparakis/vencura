import type {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import { ethers } from 'ethers';
import { response } from '../utils/response';
import {createHandler} from '../middleware/middleware';
import { generateMnemonic } from 'bip39';
import { CreateUserSchema } from '../schemas';
import {validateBody} from '../utils/zodValidators';
import {getLogger} from '../middleware/logger';
import {encrypt} from '../utils/crypto';
import {getDb} from '../utils/dbUtils';
import {createNewUser} from "../repo/userRepo";


const createUser =   async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const db = getDb();
    // Cast to validated schema type
    const { password } = validateBody(event, CreateUserSchema);
    const mnemonic = generateMnemonic()
    const encryptedMnemonic = encrypt(mnemonic, password);
    logger.debug({encryptedMnemonic});
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    const newUser = await createNewUser(
        event.requestContext.authorizer?.claims?.sub,
        event.requestContext.authorizer?.claims?.email,
        encryptedMnemonic,
        wallet.address,
        wallet.publicKey
    );


    return response(200, {newUser});
}

export const handler = createHandler(createUser);
