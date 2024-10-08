import middy from "@middy/core";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";


// Define reusable type variables
type MiddlewareObj = middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddlewareFn = middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddyRequest = middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context>

type HandlerFunction = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

type CryptoTransactionStatus = 'enqueued' | 'failed' | 'succeeded';

export {
    MiddlewareObj,
    MiddlewareFn,
    MiddyRequest,
    HandlerFunction,
    CryptoTransactionStatus
}
