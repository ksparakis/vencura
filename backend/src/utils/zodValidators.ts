import createError from 'http-errors';
import {APIGatewayProxyEvent, type SQSEvent} from "aws-lambda";
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


function validateQuery<TQuery extends ZodType<any>>(event: APIGatewayProxyEvent, querySchema: TQuery): Zod.infer<TQuery> {
    if (!event.queryStringParameters) {
        throw new createError.BadRequest("Query string parameters are required but were not provided.");
    }

    try {
        // Parse query string parameters with schema
        const parsedQuery = querySchema.parse(event.queryStringParameters);

        // Check for any NaN values after parsing
        for (const key in parsedQuery) {
            if (typeof parsedQuery[key] === 'number' && isNaN(parsedQuery[key])) {
                throw new createError.BadRequest(`Invalid query string parameters: ${key} is not a valid number`);
            }
        }

        return parsedQuery;
    } catch (error: any) {
        throw new createError.BadRequest(`Invalid query string parameters: ${error.message}`);
    }
}

function validateSQSBody<TBody>(event: SQSEvent, eventSchema: ZodType<TBody>): TBody {
    const body = JSON.parse(event.Records[0].body);
    try{
        return eventSchema.parse(body);
    } catch (error: any) {
        throw new createError.BadRequest(`Invalid Event Body: ${error.message}`);
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
    validatePath,
    validateSQSBody
}
