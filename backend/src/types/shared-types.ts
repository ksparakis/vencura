import middy from "@middy/core";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DbConnection} from "../utils/DbConnection";

// Extend the Context type to include 'db'
interface CustomContext extends Context {
    db: DbConnection | undefined // Add your custom 'db' property
}

// Define reusable type variables
type MiddlewareObj = middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddlewareFn = middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddyRequest = middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error, CustomContext>

export {
    MiddlewareObj,
    MiddlewareFn,
    MiddyRequest
}
