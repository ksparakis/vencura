import {AsyncLocalStorage} from 'node:async_hooks';
import middy from '@middy/core';
import type {APIGatewayProxyEvent, Context} from 'aws-lambda';
import jsonBodyParser from "@middy/http-json-body-parser";

export const localStorage = new AsyncLocalStorage();


export const middleware = (handler: any) => middy(async ( event: APIGatewayProxyEvent, context: Context) => {
    let result;

    await localStorage.run(new Map(), async () => {
        result = await handler(event, context);
    });

    return result;
}).use(jsonBodyParser())
;
