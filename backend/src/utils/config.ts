import moize from 'moize';
import {z} from 'zod';


const specs = z.object({
    COCKROACH_DB_NAME: z.string().optional(),
    COCKROACH_HOST: z.string().optional(),
    COCKROACH_PASSWORD: z.string().optional(),
    COCKROACH_SSL_CERT: z.string().optional(),
    COCKROACH_URL: z.string().optional(),
    COCKROACH_USER: z.string().optional(),
    COCKROACH_POOL_MAX: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    COCKROACH_PORT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    COCKROACH_ENABLE_LOGGING: z.preprocess((val) => (val === 'true'), z.boolean().optional()),
    COCKROACH_ENABLE_SSL: z.preprocess((val) => (val === 'true'), z.boolean().optional()),
    TRANSACTION_RETRY_COUNT: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    TRANSACTION_RETRY_TIMEOUT_MS: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    ENVIRONMENT: z.string().optional(),
    NODE_PATH: z.string().optional(),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .default('debug'),
    INFURA_NETWORK: z.string().default('sepolia'),
    INFURA_PROJECT_ID: z.string(),
    INFURA_SECRET: z.string(),
    QUEUE_URL: z.string()
});

// Create a memoized function to get the config
export const getConfig = moize(() => {
    // Parse and validate the environment variables
    let config;
    try{
       config = specs.parse(process.env);
    } catch (error: any) {
        throw new Error(`Invalid environment variables: ${JSON.stringify(error.errors)}`);
    }
    return config
});
