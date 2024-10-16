import middy from '@middy/core';
import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {asyncLocalStorage} from './asyncLocalStorage';
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandlerMiddleware from "./httpErrorHandlerMiddleware";
import {loggerMiddleware} from "./logger";
import httpSecurityHeaders from "@middy/http-security-headers";
import {dbMiddleware} from "./dbMiddleware";
import httpCors, {Options as CorsOptions} from "@middy/http-cors";

const corsOptions: CorsOptions= {
    origin: '*',
    requestMethods: 'GET,POST,PUT,DELETE,OPTIONS',
    requestHeaders: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-Amzn-Trace-Id',
}

export function createHandler(handlerFunction: any) {
    const middyHandler = middy(handlerFunction)
        .use(httpCors(corsOptions))
        .use(httpErrorHandlerMiddleware())
        .use(httpHeaderNormalizer())
        .use(httpSecurityHeaders())
        .use(jsonBodyParser())
        .use(loggerMiddleware())
        .use(dbMiddleware());

    return async (event: APIGatewayProxyEvent, context: Context) => {
        return asyncLocalStorage.run(new Map(), async () => {
            return await middyHandler(event, context);
        });
    };
}

export function createSQSHandler(handlerFunction: any) {
    const middyHandler = middy(handlerFunction)
        .use(httpErrorHandlerMiddleware())
        .use(loggerMiddleware())
        .use(dbMiddleware());

    return async (event: APIGatewayProxyEvent, context: Context) => {
        return asyncLocalStorage.run(new Map(), async () => {
            return await middyHandler(event, context);
        });
    };
}
