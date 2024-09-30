import moize from 'moize';
import {z} from 'zod';

const specs = z.object({
    COCKROACH_DB_NAME: z.string().optional(),
    COCKROACH_HOST: z.string().optional(),
    COCKROACH_PASSWORD: z.string().optional(),
    COCKROACH_SSL_CERT: z.string().optional(),
    COCKROACH_URL: z.string().optional(),
    COCKROACH_USER: z.string().optional(),
    COCKROACH_POOL_MAX: z.number().optional(),
    COCKROACH_PORT: z.number().optional(),
    COCKROACH_ENABLE_LOGGING: z.boolean().optional(),
    COCKROACH_ENABLE_SSL: z.boolean().optional(),
    TRANSACTION_RETRY_COUNT: z.number().optional(),
    TRANSACTION_RETRY_TIMEOUT_MS: z.number().optional(),
    // CORS_ALLOWED_HEADERS: z.string(),
    // CORS_ORIGIN: z.string(),
    ENVIRONMENT: z.string().optional(),
    NODE_PATH: z.string().optional(),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
        .default('debug'),
});

// Create a memoized function to get the config
export const getConfig = moize(() => {
    // Parse and validate the environment variables
    return specs.parse(process.env);
});
