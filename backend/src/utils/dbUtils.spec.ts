import { getDb, getDbConfig } from './dbUtils'; // Adjust the import path based on your structure
import { asyncLocalStorage } from '../middleware/asyncLocalStorage';
import { DataSourceOptions, DataSource } from 'typeorm';
import { getConfig } from './config';
import { User } from '../models/users';
import { CryptoTransactions } from '../models/cryptoTransactions';

jest.mock('../middleware/asyncLocalStorage', () => ({
    asyncLocalStorage: {
        getStore: jest.fn(),
    },
}));

jest.mock('./config', () => ({
    getConfig: jest.fn(),
}));

// Mock DataSource to avoid real database connection errors
jest.mock('typeorm', () => {
    const actualTypeOrm = jest.requireActual('typeorm');
    return {
        ...actualTypeOrm,
        DataSource: jest.fn(() => ({
            initialize: jest.fn(),
            queryRunner: jest.fn(),
            manager: jest.fn(),
        })),
    };
});

describe('getDbConfig', () => {
    it('should return the correct database configuration', () => {
        const mockConfig = {
            COCKROACH_USER: 'user123',
            COCKROACH_PASSWORD: 'password123',
            COCKROACH_HOST: 'localhost',
            COCKROACH_PORT: 26257,
            COCKROACH_DB_NAME: 'mydb',
            COCKROACH_ENABLE_SSL: true,
            COCKROACH_SSL_CERT: 'cert123',
            COCKROACH_POOL_MAX: 10,
        };

        // Mocking getConfig to return the mockConfig
        (getConfig as unknown as jest.Mock).mockReturnValue(mockConfig);

        const result = getDbConfig();

        const expectedConfig: DataSourceOptions = {
            username: mockConfig.COCKROACH_USER,
            type: 'cockroachdb',
            password: mockConfig.COCKROACH_PASSWORD,
            host: mockConfig.COCKROACH_HOST,
            port: mockConfig.COCKROACH_PORT,
            database: mockConfig.COCKROACH_DB_NAME,
            ssl: {
                rejectUnauthorized: mockConfig.COCKROACH_ENABLE_SSL,
                cert: mockConfig.COCKROACH_SSL_CERT,
            },
            maxTransactionRetries: 5,
            poolSize: mockConfig.COCKROACH_POOL_MAX,
            timeTravelQueries: false,
            entities: [User, CryptoTransactions],
        };

        expect(result).toEqual(expectedConfig);
    });
});

describe('getDb', () => {
    it('should return the db instance from asyncLocalStorage store', () => {
        const mockDb = new DataSource({} as DataSourceOptions); // Mocked DataSource instance

        // Mocking asyncLocalStorage.getStore to return an object with db
        (asyncLocalStorage.getStore as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(mockDb),
        });

        const result = getDb();
        expect(result).toBe(mockDb);
    });

    it('should throw an error if asyncLocalStorage store is not available', () => {
        // Mocking asyncLocalStorage.getStore to return null
        (asyncLocalStorage.getStore as jest.Mock).mockReturnValue(null);

        expect(() => getDb()).toThrowError('AsyncLocalStorage not available');
    });
});
