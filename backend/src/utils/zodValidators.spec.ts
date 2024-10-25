import createError from 'http-errors';
import { APIGatewayProxyEvent, SQSEvent } from 'aws-lambda';
import { z } from 'zod';
import { validateBody, validateQuery, validatePath, validateSQSBody } from './zodValidators'; // Adjust the import path accordingly

describe('validateBody', () => {
    const bodySchema = z.object({
        name: z.string(),
        age: z.number(),
    });

    it('should validate and parse a valid body', () => {
        const event = {
            body: { name: 'John', age: 30 },
        } as unknown;

        const result = validateBody(event as APIGatewayProxyEvent, bodySchema);

        expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should throw an error if the body is missing', () => {
        const event = {} as APIGatewayProxyEvent;

        expect(() => validateBody(event, bodySchema)).toThrow(
            new createError.BadRequest('Body is required but was not provided.')
        );
    });

    it('should throw an error if the body is invalid', () => {
        const event = {
            body: JSON.stringify({ name: 'John', age: 'invalid' }),
        } as APIGatewayProxyEvent;

        expect(() => validateBody(event, bodySchema)).toThrow();
    });
});

describe('validateQuery', () => {
    const querySchema = z.object({
        limit: z.string().transform((val) => parseInt(val, 10)).optional(), // Transform string to number
        sort: z.enum(['asc', 'desc']),  // String remains as string but limited to allowed values
        active: z.string().transform((val) => val === 'true').optional(), // Transform string to boolean
    });

    it('should validate and parse valid query parameters with transformations', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { limit: '10', sort: 'asc', active: 'true' },
        };

        const result = validateQuery(event as APIGatewayProxyEvent, querySchema);

        expect(result).toEqual({ limit: 10, sort: 'asc', active: true });
    });

    it('should throw an error if required parameters are missing', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { limit: '10', active: 'true' }, // Missing 'sort'
        };

        expect(() => validateQuery(event as APIGatewayProxyEvent, querySchema)).toThrow(
        );
    });

    it('should throw an error if a parameter is invalid (enum)', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { limit: '10', sort: 'invalid', active: 'true' }, // Invalid 'sort'
        };

        expect(() => validateQuery(event as APIGatewayProxyEvent, querySchema)).toThrow();
    });

    it('should throw an error if a parameter cannot be transformed (number)', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { limit: 'not-a-number', sort: 'asc', active: 'true' },
        };
        expect(() => validateQuery(event as APIGatewayProxyEvent, querySchema)).toThrow();
    });

    it('should handle optional parameters', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: { sort: 'desc' }, // Only 'sort' is provided, 'limit' and 'active' are optional
        };

        const result = validateQuery(event as APIGatewayProxyEvent, querySchema);

        expect(result).toEqual({ sort: 'desc' });
    });

    it('should throw an error if no query string parameters are provided', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            queryStringParameters: null, // No parameters provided
        };

        expect(() => validateQuery(event as APIGatewayProxyEvent, querySchema)).toThrow(
            new createError.BadRequest('Query string parameters are required but were not provided.')
        );
    });
});

describe('validatePath', () => {
    const pathSchema = z.object({
        userId: z.string().uuid(),
    });

    it('should validate and parse valid path parameters', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            pathParameters: { userId: '123e4567-e89b-12d3-a456-426614174000' },
        };

        const result = validatePath(event as APIGatewayProxyEvent, pathSchema);

        expect(result).toEqual({ userId: '123e4567-e89b-12d3-a456-426614174000' });
    });

    it('should throw an error if path parameters are missing', () => {
        const event = {} as APIGatewayProxyEvent;

        expect(() => validatePath(event, pathSchema)).toThrow();
    });

    it('should throw an error if the path parameter is invalid', () => {
        const event: Partial<APIGatewayProxyEvent> = {
            pathParameters: { userId: 'invalid-uuid' },
        };

        expect(() => validatePath(event as APIGatewayProxyEvent, pathSchema)).toThrow();
    });
});

describe('validateSQSBody', () => {
    const eventSchema = z.object({
        action: z.string(),
        timestamp: z.number(),
    });

    it('should validate and parse a valid SQS body', () => {
        const event = {
            Records: [{ body: JSON.stringify({ action: 'process', timestamp: 1635000000 }) }],
        } as SQSEvent;

        const result = validateSQSBody(event, eventSchema);

        expect(result).toEqual({ action: 'process', timestamp: 1635000000 });
    });

    it('should throw an error if the SQS body is invalid', () => {
        const event = {
            Records: [{ body: JSON.stringify({ action: 'process', timestamp: 'invalid' }) }],
        } as SQSEvent;

        expect(() => validateSQSBody(event, eventSchema)).toThrow();
    });
});
