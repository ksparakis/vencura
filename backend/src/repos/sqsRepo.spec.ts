import { SQSClient, SendMessageCommand, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { enqueueMessage } from "./sqsRepo"; // Adjust the path as necessary
import { getConfig } from "../utils/config";
import createHttpError from "http-errors";
import { getLogger } from "../middleware/logger";

// Mocking dependencies
jest.mock('@aws-sdk/client-sqs');
jest.mock('../utils/config');
jest.mock('../middleware/logger');

const mockSQSClient = SQSClient as jest.Mock;
const mockGetConfig = getConfig as unknown as jest.Mock;
const mockGetLogger = getLogger as jest.Mock;

describe('Sqs Repo', () => {
    let mockSend: jest.Mock;
    let mockLogger: any;
    let mockConfig: any;

    beforeEach(() => {
        mockSend = jest.fn();
        mockSQSClient.mockImplementation(() => {
            return {
                send: mockSend
            };
        });

        mockLogger = {
            error: jest.fn(),
        };
        mockGetLogger.mockReturnValue(mockLogger);

        mockConfig = { QUEUE_URL: 'https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue' };
        mockGetConfig.mockReturnValue(mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should send a message to SQS with the correct parameters', async () => {
        const payload = { transactionId: "123", amount: "100" };

        // Add the required `$metadata` field to the mock response
        const mockResponse: SendMessageCommandOutput = {
            MessageId: "test-message-id",
            $metadata: {
                httpStatusCode: 200,
                requestId: "mock-request-id",
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0,
            },
        };

        mockSend.mockResolvedValue(mockResponse);

        const result = await enqueueMessage(payload);

        expect(mockSend).toHaveBeenCalledWith(expect.any(SendMessageCommand));
        expect(result).toBe(mockResponse);
    });


    it('should log the error and throw InternalServerError if SQS send fails', async () => {
        const payload = { transactionId: "123", amount: "100" };
        const mockError = new Error('SQS Error');
        mockSend.mockRejectedValue(mockError);

        await expect(enqueueMessage(payload))
            .rejects
            .toThrow(new createHttpError.InternalServerError('Error sending message to SQS'));

        expect(mockLogger.error).toHaveBeenCalledWith({ error: mockError });
    });
});
