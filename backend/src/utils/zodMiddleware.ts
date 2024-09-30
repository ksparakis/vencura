// src/middlewares/zodValidator.ts

import {z, ZodError} from 'zod';
import createHttpError from "http-errors";

export const zodValidator = (schema: z.ZodSchema<any>): any => ({
    before: async (handler: any) => {
        try {
            // Parse and validate the request body
            handler.event.body = schema.parse(handler.event.body); // Replace the body with the parsed data
        } catch (error) {
            if (error instanceof ZodError) {
                throw new createHttpError.BadRequest(`Invalid request body: ${JSON.stringify(error.errors)}`);
            } else {
                throw error; // Re-throw if it's not a validation error
            }
        }
    },
});
