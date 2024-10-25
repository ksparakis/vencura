import { getUserBySub, createNewUser, getUsersWalletAddress, retrieveAllUsersExcludingSub } from './userRepo'; // Adjust path
import { getDb } from '../utils/dbUtils';
import { getLogger } from '../middleware/logger';
import { User } from '../models/users';
import createHttpError from 'http-errors';
import { Not } from 'typeorm';

// Mock dependencies
jest.mock('../utils/dbUtils', () => ({
    getDb: jest.fn(),
}));

jest.mock('../middleware/logger', () => ({
    getLogger: jest.fn().mockReturnValue({
        debug: jest.fn(),
        error: jest.fn(),
    }),
}));

describe('User Repo Tests', () => {
    let mockDb: any;
    let mockUserRepository: any;

    beforeEach(() => {
        mockUserRepository = {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
        };

        mockDb = {
            getRepository: jest.fn().mockReturnValue(mockUserRepository),
        };

        (getDb as jest.Mock).mockReturnValue(mockDb);
        jest.clearAllMocks();
    });

    describe('getUserBySub', () => {
        it('should return the user if found', async () => {
            const mockUser = { sub: 'mockSub', address: 'mockAddress' };
            mockUserRepository.findOneBy.mockResolvedValue(mockUser);

            const result = await getUserBySub('mockSub');

            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ sub: 'mockSub' });
            expect(result).toEqual(mockUser);
        });

        it('should throw NotFound error if the user is not found', async () => {
            mockUserRepository.findOneBy.mockResolvedValue(null);

            await expect(getUserBySub('mockSub')).rejects.toThrow(createHttpError.NotFound('User not found'));
        });
    });

    describe('getUsersWalletAddress', () => {
        it('should return the user\'s wallet address', async () => {
            const mockUser = { sub: 'mockSub', address: 'mockAddress' };
            mockUserRepository.findOneBy.mockResolvedValue(mockUser);

            const result = await getUsersWalletAddress('mockSub');

            expect(result).toEqual('mockAddress');
            expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ sub: 'mockSub' });
        });
    });

    describe('createNewUser', () => {
        it('should create a new user if not already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            const mockNewUser = { save: jest.fn().mockResolvedValue({ sub: 'mockSub' }) };
            mockUserRepository.create.mockReturnValue(mockNewUser);

            const result = await createNewUser('mockSub', 'mockEmail', 'mockEncryptedMnemonic', 'mockAddress', 'mockPublicKey');

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { sub: 'mockSub' } });
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                sub: 'mockSub',
                email: 'mockEmail',
                encryptedMnemonic: 'mockEncryptedMnemonic',
                address: 'mockAddress',
                publicKey: 'mockPublicKey',
                selectedNetwork: 'sepolia',
                passwordEncryptionPvtKey: undefined,
            });
            expect(mockNewUser.save).toHaveBeenCalled();
            expect(result).toEqual({ sub: 'mockSub' });
        });

        it('should throw BadRequest error if user already exists', async () => {
            const mockExistingUser = { sub: 'mockSub' };
            mockUserRepository.findOne.mockResolvedValue(mockExistingUser);

            await expect(
                createNewUser('mockSub', 'mockEmail', 'mockEncryptedMnemonic', 'mockAddress', 'mockPublicKey')
            ).rejects.toThrow(createHttpError.BadRequest(`User with sub mockSub already exists.`));

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { sub: 'mockSub' } });
        });
    });

    describe('retrieveAllUsersExcludingSub', () => {
        it('should return all users except the given sub', async () => {
            const mockUsers = [
                { sub: 'user1', email: 'email1', address: 'address1', publicKey: 'key1' },
                { sub: 'user2', email: 'email2', address: 'address2', publicKey: 'key2' },
            ];
            mockUserRepository.find.mockResolvedValue(mockUsers);

            const result = await retrieveAllUsersExcludingSub('mockSub');

            expect(mockUserRepository.find).toHaveBeenCalledWith({
                where: { sub: Not('mockSub') },
                select: ['sub', 'email', 'address', 'publicKey'],
            });
            expect(result).toEqual(mockUsers);
        });
    });
});
