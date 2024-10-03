import crypto from "crypto";

function encrypt(text: string, password: string) {
    const IV_LENGTH = 16; // IV should be 16 bytes for AES
    const KEY_LENGTH = 32; // Key length for AES-256 is 32 bytes

    // Generate a random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive the key from the password
    const key = crypto.createHash('sha256').update(password).digest(); // Hash the password to fit the key length

    // Create cipher using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the IV and encrypted text, both in hexadecimal format
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText: string, password: string) {
    const IV_LENGTH = 16; // IV should be 16 bytes for AES

    // Split the encrypted text into the IV and the encrypted data
    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
        throw new Error('Invalid encrypted text format');
    }

    const iv = Buffer.from(textParts[0], 'hex');
    if (iv.length !== IV_LENGTH) {
        throw new Error('Invalid IV length');
    }

    const encryptedData = Buffer.from(textParts[1], 'hex');

    // Use a key derivation function for better security (PBKDF2 with salt)
    const salt = 'somesecure_salt'; // Ideally, store and use a unique salt for each user
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256'); // Derive a key using PBKDF2

    // Create decipher using AES-256-CBC
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the text using Buffer
    let decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    // Return the decrypted text as a utf8 string
    return decrypted.toString('utf8');
}

export{
    encrypt,
    decrypt
}
