import { createLogger, format, transports, Logger } from 'winston';
import { MiddlewareObj } from '@middy/core';
import {getConfig} from "../utils/config";
import {asyncLocalStorage} from "./asyncLocalStorage";

const config = getConfig();
declare module 'aws-lambda' {
    interface Context {
        logger: Logger;
    }
}

// Module-level variable to store the logger instance
let logger: Logger | null = null;

// Function to initialize the logger
export const initLogger = () => {
    logger = createLogger({
        level: config.LOG_LEVEL || 'info',
        format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        ),
        transports: [
            new transports.Console()
        ],
    });
};

// Exported function to get the logger instance
export const getLogger = (): Logger => {
    if (!logger) {
        throw new Error('Logger has not been initialized yet.');
    }
    return logger;
};

export const loggerMiddleware = (): MiddlewareObj<any, any> => {
    return {
        before: (handler: any ) => {
            if (!logger) {
                initLogger(); // Initialize the logger if it hasn't been already
            }

            // Attach the logger to the storage
            asyncLocalStorage.getStore()?.set('logger', logger);
        },
    };
};
