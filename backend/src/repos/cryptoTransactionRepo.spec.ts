import { getDb } from "../utils/dbUtils";
import { newTransaction, checkTransactionCompleted, updateTransactionStatus } from "./cryptoTransactionsRepo"; // Adjust the import path
import createHttpError from "http-errors";
import { v4 as uuidv4 } from 'uuid';
import { CryptoTransactionStatus } from "../types/shared-types";
import { UpdateResult } from "typeorm";

// Mock dependencies
jest.mock("../utils/dbUtils");
jest.mock("uuid");

const mockGetDb = getDb as jest.Mock;
const mockUuidv4 = uuidv4 as jest.Mock;

describe('Crypto Transaction Repo', () => {
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn()
        };

        mockGetDb.mockReturnValue({
            getRepository: jest.fn().mockReturnValue(mockRepository)
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('newTransaction', () => {
        it('should create and save a new transaction', async () => {
            const sub = "user-sub";
            const to = "recipient-address";
            const amount = "100.0";
            const transactionId = "tx-id";

            const mockTx = { id: transactionId, save: jest.fn() };
            mockRepository.create.mockReturnValue(mockTx);
            mockUuidv4.mockReturnValue(transactionId);
            mockTx.save.mockResolvedValue(mockTx);

            const result = await newTransaction(sub, to, amount);

            expect(mockRepository.create).toHaveBeenCalledWith({
                id: transactionId,
                sub,
                amount,
                status: 'enqueued',
                to
            });
            expect(mockTx.save).toHaveBeenCalled();
            expect(result).toEqual(mockTx);
        });
    });

    describe('checkTransactionCompleted', () => {
        it('should return the transaction if it exists', async () => {
            const transactionId = "tx-id";
            const mockTx = { id: transactionId, status: 'completed' };
            mockRepository.findOneBy.mockResolvedValue(mockTx);

            const result = await checkTransactionCompleted(transactionId);

            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: transactionId });
            expect(result).toEqual(mockTx);
        });

        it('should throw a 404 error if the transaction is not found', async () => {
            const transactionId = "tx-id";
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(checkTransactionCompleted(transactionId))
                .rejects
                .toThrow(new createHttpError.NotFound('Transaction not found'));

            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: transactionId });
        });
    });

    describe('updateTransactionStatus', () => {
        it('should update the transaction status and message', async () => {
            const transactionId = "tx-id";
            const status: CryptoTransactionStatus = 'succeeded';
            const message = "Transaction completed";
            const mockUpdateResult = { affected: 1 } as UpdateResult;
            mockRepository.update.mockResolvedValue(mockUpdateResult);

            const result = await updateTransactionStatus(transactionId, status, message);

            expect(mockRepository.update).toHaveBeenCalledWith(
                { id: transactionId },
                { status, message }
            );
            expect(result).toEqual(mockUpdateResult);
        });
    });
});
