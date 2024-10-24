async function rsaEncrypt(publicKey: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
        'spki',
        Buffer.from(publicKey, 'base64'),
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

    return Buffer.from(encrypted).toString('base64');
}
export {
    rsaEncrypt
}
