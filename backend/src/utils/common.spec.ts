import { getWalletForUser, getClaims } from './common'; // Adjust the path
import { getUserBySub } from '../repos/userRepo';
import { decrypt, rsaDecrypt } from './crypto'; // Include rsaDecrypt
import { getWallet } from '../repos/walletUtil';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { HDNodeWallet } from 'ethers';
import { Claims, TokenPayload } from '../types/shared-types';
import createHttpError from 'http-errors';

// Mock the dependencies
jest.mock('../repos/userRepo', () => ({
    getUserBySub: jest.fn(),
}));

jest.mock('./crypto', () => ({
    decrypt: jest.fn(),
    rsaDecrypt: jest.fn(),
}));

jest.mock('../repos/walletUtil', () => ({
    getWallet: jest.fn(),
}));

describe('common.ts', () => {
    describe('getWalletForUser', () => {
        const mockUser = {
            encryptedMnemonic: 'mockEncryptedMnemonic',
            passwordEncryptionPvtKey: 'mockPrivateKey',
            selectedNetwork: 'mockNetwork',
        };

        const mockPassword = 'decryptedPassword';
        const mockMnemonic = 'mockMnemonic';
        const mockWallet = {} as HDNodeWallet; // Mock a wallet object

        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks before each test
        });

        it('should retrieve the wallet for a user given valid sub and encrypted password', async () => {
            (getUserBySub as jest.Mock).mockResolvedValue(mockUser);
            (rsaDecrypt as jest.Mock).mockResolvedValue(mockPassword); // Mock rsaDecrypt
            (decrypt as jest.Mock).mockReturnValue(mockMnemonic);
            (getWallet as jest.Mock).mockReturnValue(mockWallet);

            const result = await getWalletForUser('mockSub', 'mockEncryptedPassword');

            expect(getUserBySub).toHaveBeenCalledWith('mockSub');
            expect(rsaDecrypt).toHaveBeenCalledWith('mockPrivateKey', 'mockEncryptedPassword');
            expect(decrypt).toHaveBeenCalledWith('mockEncryptedMnemonic', mockPassword, 'mockSub');
            expect(getWallet).toHaveBeenCalledWith(mockMnemonic, 'mockNetwork');
            expect(result).toBe(mockWallet);
        });

        it('should throw an error if the user has not set up the encryption key', async () => {
            const mockUserWithoutKey = {...mockUser, passwordEncryptionPvtKey: null};

            (getUserBySub as jest.Mock).mockResolvedValue(mockUserWithoutKey);

            await expect(getWalletForUser('mockSub', 'mockEncryptedPassword')).rejects.toThrow(
                createHttpError.BadRequest('User has not set up their encryption key')
            );
        });

        it('should throw an error if the user is not found', async () => {
            (getUserBySub as jest.Mock).mockResolvedValue(null);

            await expect(getWalletForUser('mockSub', 'mockEncryptedPassword')).rejects.toThrow();
        });
    });

    describe('getClaims', () => {
        const mockClaims: Partial<Claims> = {
            sub: 'mockSub',
            // Add other claims as needed for the test
        };

        it('should return parsed claims when claims are an object', () => {
            const event = {
                requestContext: {
                    authorizer: {
                        claims: mockClaims as Claims,
                    },
                },
            } as unknown as APIGatewayProxyEvent;

            const result = getClaims(event);
            expect(result).toEqual(mockClaims);
        });

        it('should parse and return claims when claims are a string', () => {
            const stringClaims = JSON.stringify(mockClaims);

            const event = {
                requestContext: {
                    authorizer: {
                        claims: stringClaims,
                    },
                },
            } as unknown as APIGatewayProxyEvent;

            const result = getClaims(event);
            expect(result).toEqual(mockClaims);
        });

        it('should throw an error if no claims are found', () => {
            const event = {
                requestContext: {
                    authorizer: {},
                },
            } as unknown as APIGatewayProxyEvent;

            expect(() => getClaims(event)).toThrow('No authorizer found in request');
        });
    });
});
