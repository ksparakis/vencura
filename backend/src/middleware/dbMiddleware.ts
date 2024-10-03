import { MiddyRequest } from '../types/shared-types';
import {getDb, getDbConfig} from '../utils/dbUtils';
import {DataSource} from "typeorm";
import {getConfig} from "../utils/config";
import {asyncLocalStorage} from "./asyncLocalStorage";
import {getLogger} from "./logger";


const closeConnection = async (handler: any) => {
    try{
        const db = getDb()

        if (db.isInitialized) {
            await db.destroy();
        }
    } catch (error) {}
};

export const dbMiddleware = (): any => {

    return {
        before: async (handler : MiddyRequest): Promise<void> => {
            const logger = getLogger();
            logger.debug("Running DB middleware");
            const db = await connect();
            const store = asyncLocalStorage.getStore();
            logger.debug("Retrieved Async Store", {store})
            if (store) {
                store.set('db', db);
            } else {

                throw Error('AsyncLocalStorage not available');
            }
        },
        after: closeConnection,
        onError: closeConnection
    };
};


async function connect() : Promise<DataSource> {
    const config = getConfig();
    const logger = getLogger();
    let db: DataSource | undefined;
    try {
        db = getDb();
    } catch (error) {
        logger.debug('No DB or async localstorage yet');
    }

    if(db?.isInitialized){
        logger.debug('Database already connected');
        return db;
    }
    const dbConfig = getDbConfig();
    db = new DataSource(dbConfig)
    await db.initialize()
    logger.debug('Connected to database');


    return db;
}

