import {asyncLocalStorage} from '../middleware/asyncLocalStorage';
import {DataSourceOptions, DataSource} from "typeorm";
import {getConfig} from "./config";
import {User} from "../models/users";
import {CryptoTransactions} from "../models/cryptoTransactions";

function getDbConfig() :DataSourceOptions {
    const config = getConfig();
    return  {
        username: config.COCKROACH_USER,
        type: 'cockroachdb',
        password: config.COCKROACH_PASSWORD,
        host: config.COCKROACH_HOST,
        port: config.COCKROACH_PORT,
        database: config.COCKROACH_DB_NAME,
        ssl: {
            rejectUnauthorized: config.COCKROACH_ENABLE_SSL,
            cert: config.COCKROACH_SSL_CERT
        },
        maxTransactionRetries: 5,
        poolSize: config.COCKROACH_POOL_MAX,
        timeTravelQueries: false,
        entities: [User, CryptoTransactions],
    }
}


function getDb() : DataSource {
    const store = asyncLocalStorage.getStore();

    if (store) {
        return store.get('db');
    }
    throw Error('AsyncLocalStorage not available');
}


export {
    getDb,
    getDbConfig
}
