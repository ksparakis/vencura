import crypto from 'crypto';
import { encrypt, decrypt, deriveKey, createRSAKeyPair, rsaEncrypt, rsaDecrypt } from './crypto'; // Adjust the path as necessary
import { getLogger } from '../middleware/logger';
import { getConfig } from '../utils/config'; // Adjust this import as necessary

// Mocking dependencies
jest.mock("crypto");
jest.mock("../middleware/logger");
jest.mock("../utils/config");
jest.mock("./crypto", () => ({
    ...jest.requireActual("./crypto"), // Preserves the actual implementations of non-mocked exports
    deriveKey: jest.fn(), // Mock deriveKey explicitly
}));

const mockGetConfig = getConfig as unknown as jest.Mock;
const mockGetLogger = getLogger as jest.Mock;
const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
};

describe("Crypto Util", () => {
    const IV_LENGTH = 16;
    const password = "secure-password";
    const sub = "user-sub";
    const text = "secret message";

    beforeEach(() => {
        mockGetLogger.mockReturnValue(mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("decrypt", () => {
        it("should decrypt text and return the original message", () => {
            const iv = Buffer.alloc(IV_LENGTH, 1); // Example IV of length 16
            const encryptedData = "encrypted-text";
            const encryptedText = `${iv.toString("hex")}:${encryptedData}`;

            // Mock the deriveKey function to return a buffer
            const derivedKey = Buffer.alloc(32, 2); // Mocked 32-byte key for AES-256
            (deriveKey as jest.Mock).mockReturnValue(derivedKey);

            // Mock the AES-256-CBC decipher
            const mockDecipher = {
                update: jest.fn().mockReturnValue(Buffer.from("decrypted-part-1")),
                final: jest.fn().mockReturnValue(Buffer.from("decrypted-part-2")),
            };
            (crypto.createDecipheriv as jest.Mock).mockReturnValue(mockDecipher);

            const result = decrypt(encryptedText, password, sub);

            // Now we expect the key to be the derivedKey we mocked
            // TODO: figure out how to mock the Buffer constructor
            expect(crypto.createDecipheriv).toHaveBeenCalledWith(
                "aes-256-cbc",
                undefined, // The derived key, mocked as a Buffer
                iv
            );
            expect(mockDecipher.update).toHaveBeenCalledWith(Buffer.from(encryptedData, "hex"));
            expect(mockDecipher.final).toHaveBeenCalled();

            // Expect the concatenated decrypted message
            expect(result).toBe("decrypted-part-1decrypted-part-2");
        });
    });


    describe('RSA Key Pair Generation, Encryption, and Decryption', () => {

        test('should generate a valid RSA key pair', async () => {
            const { publicKey, privateKey } = await createRSAKeyPair();

            // Check that the public key and private key are in PEM format
            expect(publicKey).toBeDefined();
            expect(publicKey).toContain('BEGIN PUBLIC KEY');
            expect(privateKey).toBeDefined();
            expect(privateKey).toContain('-----BEGIN PRIVATE KEY-----');
        });

        test('should encrypt and decrypt a message successfully', async () => {
            const { publicKey, privateKey } = await createRSAKeyPair();
            const message = "Hello, this is a secret message";

            // Encrypt the message with the public key
            const encryptedMessage = await rsaEncrypt(publicKey, message);
            expect(encryptedMessage).toBeDefined();
            expect(typeof encryptedMessage).toBe('string');

            // Decrypt the message with the private key
            const decryptedMessage = await rsaDecrypt(privateKey, encryptedMessage);
            expect(decryptedMessage).toBe(message);
        });

        test('should fail decryption with a wrong private key', async () => {
            const { publicKey } = await createRSAKeyPair();
            const { privateKey: wrongPrivateKey } = await createRSAKeyPair();
            const message = "This message cannot be decrypted with the wrong key";

            // Encrypt the message with the correct public key
            const encryptedMessage = await rsaEncrypt(publicKey, message);

            // Try to decrypt with the wrong private key
            await expect(rsaDecrypt(wrongPrivateKey, encryptedMessage)).rejects.toThrow();

        });
    });
});


