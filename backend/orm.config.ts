import { DataSource } from 'typeorm';
import {getDbConfig} from './src/utils/dbUtils';

let config = getDbConfig()
const migrationsConfig = {...config, migrations: ['migrations/*.ts']}
const db = new DataSource(migrationsConfig);
db.initialize().then(() => {
    console.log('Connected to database');
});

export default db;
