import { response } from './response'; // Adjust the import path

describe('response', () => {
    it('should return a response with the correct statusCode and JSON stringified body', () => {
        const statusCode = 200;
        const body = { message: 'Success' };

        const result = response(statusCode, body);

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(body),
        });
    });

    it('should handle non-object bodies (e.g., strings)', () => {
        const statusCode = 400;
        const body = 'Error occurred';

        const result = response(statusCode, body);

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify(body),
        });
    });

    it('should handle array bodies', () => {
        const statusCode = 201;
        const body = [1, 2, 3];

        const result = response(statusCode, body);

        expect(result).toEqual({
            statusCode: 201,
            body: JSON.stringify(body),
        });
    });

    it('should handle empty body', () => {
        const statusCode = 204;
        const body = null;

        const result = response(statusCode, body);

        expect(result).toEqual({
            statusCode: 204,
            body: JSON.stringify(body),
        });
    });
});
