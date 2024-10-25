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
import {getClaims} from "../utils/common";


const createUser =   async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const logger = getLogger();
    const { sub, email} = getClaims(event)
    logger.debug( JSON.stringify(event.body));
    const { password } = validateBody(event, passwordSchema);
    const mnemonic = generateMnemonic()
    const encryptedMnemonic = encrypt(mnemonic, password, sub);
    logger.debug({encryptedMnemonic});
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    const newUser = await createNewUser(
        sub,
        email,
        encryptedMnemonic,
        wallet.address,
        wallet.publicKey,
    );

    delete newUser.passwordEncryptionPvtKey;

    return response(200, {user: newUser});
}

export const handler = createHandler(createUser);
