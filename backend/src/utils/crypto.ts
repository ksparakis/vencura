import crypto from 'crypto';
import createHttpError from 'http-errors';
import {getLogger} from '../middleware/logger';


const IV_LENGTH = 16; // IV should be 16 bytes for AES

function encrypt(text: string, password: string, sub: string) {
    const logger = getLogger();
    logger.debug('Encrypting text');
    // Generate a random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    const key = deriveKey(password, sub);
    // Create cipher using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted text, both in hexadecimal format
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText: string, password: string, sub: string) {
    const logger = getLogger();
    logger.debug('Decrypting text', {encryptedText});

    // Split the encrypted text into the IV and the encrypted data
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
        throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(textParts[0], 'hex');
    if (iv.length !== IV_LENGTH) {
        throw new Error('Invalid IV length');
    }


    // Return the decrypted text as a utf8 string
    try {
        const encryptedData = Buffer.from(textParts[1], 'hex');

        const key = deriveKey(password, sub);
        // Create decipher using AES-256-CBC
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Decrypt the text using Buffer
        const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        return  decrypted.toString('utf8');
    } catch (error: any) {

        logger.error('Invalid password', {error});
        throw new createHttpError.Unauthorized('Invalid password');
    }

}

function deriveKey(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

// Function to generate a private-public key pair using ECC
async function createRSAKeyPair(): Promise<{ publicKey: string; privateKey: string; }> {
    const { generateKeyPairSync } = await import('node:crypto');
    return generateKeyPairSync('rsa',
        {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            }
        });
}


async function rsaEncrypt(publicKey: string, text: string): Promise<string> {
    const { publicEncrypt } = await import('node:crypto');
    const encryptedMessage = publicEncrypt(publicKey, Buffer.from(text, 'utf8'));
    return encryptedMessage.toString('base64');
}

async function rsaDecrypt(privateKey: string, encrypted: string): Promise<string> {
    const { privateDecrypt } = await import('node:crypto');
    const key = Buffer.from(privateKey);
    const decryptedMessage = privateDecrypt(
        {
            key,
            passphrase: '', // Match the passphrase used during key generation (if any)
        },
        Buffer.from(encrypted, 'base64')
    );

    return  decryptedMessage.toString('utf8');
}


export {
    encrypt,
    decrypt,
    deriveKey,
    createRSAKeyPair,
    rsaEncrypt,
    rsaDecrypt,
}
