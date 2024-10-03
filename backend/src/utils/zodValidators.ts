import createError from 'http-errors';
import {APIGatewayProxyEvent} from "aws-lambda";
import {ZodType} from "zod";

function validateBody<TBody>(event: APIGatewayProxyEvent, bodySchema: ZodType<TBody>): TBody {
    if (!event.body) {
        throw new createError.BadRequest("Body is required but was not provided.");
    }

    try {
        return bodySchema.parse(event.body);
    } catch (error: any) {
        throw new createError.BadRequest(`Invalid body: ${error.message}`);
    }
}

function validateQuery<TQuery>(event: APIGatewayProxyEvent, querySchema: ZodType<TQuery>): TQuery {
    if (!event.queryStringParameters) {
        throw new createError.BadRequest("Query string parameters are required but were not provided.");
    }

    try {
        return querySchema.parse(event.queryStringParameters);
    } catch (error: any) {
        throw new createError.BadRequest(`Invalid query string parameters: ${error.message}`);
    }
}

function validatePath<TPath>(event: APIGatewayProxyEvent, pathSchema: ZodType<TPath>): TPath {
    if (!event.pathParameters) {
        throw new createError.BadRequest("Path parameters are required but were not provided.");
    }

    try {
        return pathSchema.parse(event.pathParameters);
    } catch (error: any) {
        throw new createError.BadRequest(`Invalid path parameters: ${error.message}`);
    }
}

export {
    validateBody,
    validateQuery,
    validatePath
}
