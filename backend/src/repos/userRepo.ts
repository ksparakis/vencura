import {User} from '../models/users';
import {getDb} from '../utils/dbUtils';
import {getLogger} from '../middleware/logger';
import createHttpError from 'http-errors';
import {Not} from 'typeorm';

async function getUserBySub(sub: string) {
    const db = getDb();
    const logger = getLogger();
    logger.debug('Getting user by sub', {sub});
    const user = await db.getRepository(User).findOneBy({ sub })
    logger.debug('Got user', {user});
    if(!user) {
        throw createHttpError.NotFound('User not found');
    }
    return user;
}

async function getUsersWalletAddress(sub: string) {
    const user = await getUserBySub(sub);
    return user.address;
}

async function createNewUser(sub: string, email: string, encryptedMnemonic: string, address: string, publicKey: string) {
    const db = getDb();
    const logger = getLogger();

    logger.debug('Checking if user already exists', { sub });
    const existingUser = await db.getRepository(User).findOne({ where: { sub } });

    if (existingUser) {
        logger.error('User already exists', { sub });
        throw new createHttpError.BadRequest(`User with sub ${sub} already exists.`);
    }

    logger.debug('Creating new user', { sub });
    const user = db.getRepository(User).create({
        sub,
        email,
        encryptedMnemonic,
        address,
        publicKey,
        selectedNetwork: 'sepolia',
        passwordEncryptionPvtKey: undefined
    });

    return user.save();
}


const retrieveAllUsersExcludingSub = async (sub: string): Promise<User[]> => {
    const db = getDb();
    const logger = getLogger();
    logger.debug('Getting all users except for user', {sub});

    // where sub != passed in sub
    const users = await db.getRepository(User).find({
        where: { sub: Not(sub) },
        select: ['sub', 'email', 'address', 'publicKey']
    });

    logger.debug('Got users', {users});
    return users;
}

async function saveEncryptionPvtKey(sub: string, key: string): Promise<User> {
    const db = getDb();
    const logger = getLogger();
    logger.debug('Saving encryption private key', {sub});
    const user = await db.getRepository(User).findOneBy({sub});
    if(user === null) {
        throw createHttpError.NotFound('User not found');
    }
    user.passwordEncryptionPvtKey = key;
    return user.save();
}

async function updateSelectedNetwork(sub: string, network: string): Promise<User> {
    const db = getDb();
    const logger = getLogger();
    logger.debug('Updating selected network', {sub, network});
    const user = await db.getRepository(User).findOneBy({sub});
    if(user === null) {
        throw createHttpError.NotFound('User not found');
    }
    user.selectedNetwork = network;
    return user.save();
}

export{
    getUserBySub,
    createNewUser,
    getUsersWalletAddress,
    retrieveAllUsersExcludingSub,
    saveEncryptionPvtKey,
    updateSelectedNetwork
}
