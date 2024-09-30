import pg from 'pg';
import {getLogger} from './logger';
import {getConfig} from './config';

export async function getDbConfig() : Promise<any> {
    const config = getConfig();
    const logger = getLogger();

    logger.debug('Retrieving DB Config');
    const sslCert = config.COCKROACH_SSL_CERT


    let logging : any = false;
    if(config.COCKROACH_ENABLE_LOGGING){
        logging = (log: any) => {
            logger.debug({ msg:'SEQUELIZE LOG', sequelize: log }, );
        }
    }

    const sslOpts = {
        ssl: {
            rejectUnauthorized: config.COCKROACH_ENABLE_SSL,
            require: config.COCKROACH_ENABLE_SSL,
            cert: sslCert
        }
    };

    return {
        username: config.COCKROACH_USER,
        user: config.COCKROACH_USER,
        password: config.COCKROACH_PASSWORD,
        host: config.COCKROACH_HOST,
        port: config.COCKROACH_PORT,
        database: config.COCKROACH_DB_NAME,
        logging: logging,
        dialect: 'postgres',
        dialectModule: pg,
        dialectOptions: {...sslOpts},
        pool:{
            max: config.COCKROACH_POOL_MAX
        }
    };
};
