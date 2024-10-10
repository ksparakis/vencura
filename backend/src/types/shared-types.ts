import middy from "@middy/core";
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";


// Define reusable type variables
type MiddlewareObj = middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddlewareFn = middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult>
type MiddyRequest = middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error, Context>

type HandlerFunction = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

type CryptoTransactionStatus = 'enqueued' | 'failed' | 'succeeded';

interface TokenPayload {
    kid: string;
    aud: string;
    iss: string;
    sub: string;
    sid: string;
    email: string;
    environment_id: string;
    lists: any[];
    missing_fields: any[];
    verified_credentials: {
        email: string;
        id: string;
        public_identifier: string;
        format: string;
        oauth_provider?: string;
        oauth_username?: string;
        oauth_display_name?: string;
        oauth_account_id?: string;
        oauth_account_photos?: string[];
        oauth_emails?: string[];
        oauth_metadata?: Record<string, any>;
    }[];
    last_verified_credential_id: string;
    first_visit: string;
    last_visit: string;
    new_user: boolean;
    metadata: Record<string, any>;
    iat: number;
    exp: number;
}

type Claims = TokenPayload | string ;

export {
    MiddlewareObj,
    MiddlewareFn,
    MiddyRequest,
    HandlerFunction,
    CryptoTransactionStatus,
    TokenPayload,
    Claims
}
