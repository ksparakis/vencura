import { Sequelize } from 'sequelize';
import { getLogger } from './logger';
import { getDbConfig } from './db.config';


export class DbConnection {
    db: any;
    modelsSetup;

    constructor(modelsSetup: Function) {
        this.modelsSetup = modelsSetup;
    }

    async init() {
        const dbConfig = await getDbConfig();
        const instance = new Sequelize(dbConfig);
        const models = this.modelsSetup(instance, Sequelize);

        if (!models) {
            throw Error('Models need to be returned from the modelsFunction passed into sequelize middleware');
        }

        const db = {
            sequelize: instance,
            ...models
        };

        const store = localStorage.getStore();

        if (store) {
            store.set('db', db);
        } else {
            throw Error('AsyncLocalStorage not available');
        }
        this.db = db;
    }

    async connect() : Promise<any> {
        const logger = getLogger();
        const newDbConnection = !this.db;

        logger.debug({ newDbConnection });

        if (newDbConnection) {
            await this.init();
        }

        return this.db;
    }

    async disconnect() {
        if (this.db?.sequelize) {
            await this.db.sequelize.close();
        }
        this.db = undefined;
    }
}
