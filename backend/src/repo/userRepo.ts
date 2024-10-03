import {User} from "../models/users";
import {getDb} from "../utils/dbUtils";
import {getLogger} from "../middleware/logger";
import createHttpError from "http-errors";
import {Not} from "typeorm";

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

    logger.debug('Attempting to create new user', { sub });

    const user = db.getRepository(User).create({
        sub,
        email,
        encryptedMnemonic,
        address,
        publicKey
    });

    try {
        return await user.save();
    } catch (error: any) {
        if (error.code === '23505') { // PostgreSQL error code for unique violation
            logger.error('User already exists', { sub });
            throw new createHttpError.BadRequest(`User with sub ${sub} already exists.`);
        }

        logger.error('Failed to create user', { error });
        throw error; // rethrow the error if it's not a duplicate error
    }
}

const retrieveAllUsersExcludingSub = async (sub: string): Promise<User[]> => {
    const db = getDb();
    const logger = getLogger();
    logger.debug('Getting all users except for user', {sub});

    // where sub != passed in sub
    const users = await db.getRepository(User).find({
        where: { sub: Not(sub) }
    });

    logger.debug('Got users', {users});
    return users;
}

export{
    getUserBySub, createNewUser, getUsersWalletAddress, retrieveAllUsersExcludingSub
}
