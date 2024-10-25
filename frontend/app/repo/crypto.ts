function base64ToUint8Array(base64: string): Uint8Array {
    const stripped = stripPublicKeyHeaders(base64);
    const binaryString = atob(stripped);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function stripPublicKeyHeaders(key: string): string {
    return key
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s+/g, ''); // Remove any whitespace, newlines, etc.
}

async function rsaEncrypt(message: string, publicKey: string): Promise<string> {
    const enc = new TextEncoder();
    try {
        const key = await window.crypto.subtle.importKey(
            'spki',
            base64ToUint8Array(publicKey),
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            ['encrypt']
        );
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            key,
            enc.encode(message)
        );
        // Convert Uint8Array to a regular array
        const encryptedArray = Array.from(new Uint8Array(encrypted));

        // Base64 encode the encrypted data
        const encryptedBase64 = btoa(String.fromCharCode.apply(null, encryptedArray));

        return encryptedBase64;
    } catch (e) {
        console.error(e);
    }
    return 'hi';
}
export {
    rsaEncrypt
}
