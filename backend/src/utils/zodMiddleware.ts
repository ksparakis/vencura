// src/middlewares/zodValidator.ts
import { MiddlewareObj } from '@middy/core';
import { z, ZodError } from 'zod';

export const zodValidator = (schema: z.ZodSchema<any>): MiddlewareObj => ({
    before: async (handler) => {
        try {
            // Parse and validate the request body
            const parsedBody = schema.parse(handler.event.body);
            handler.event.body = parsedBody; // Replace the body with the parsed data
        } catch (error) {
            if (error instanceof ZodError) {
                // Return a 400 response with validation errors
                handler.callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: 'Invalid request body',
                        errors: error.errors,
                    }),
                });
            } else {
                throw error; // Re-throw if it's not a validation error
            }
        }
    },
});
