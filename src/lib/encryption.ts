import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts sensitive text using AES-256-GCM.
 * The output format is: iv (hex) + authTag (hex) + encryptedText (hex)
 */
export function encrypt(text: string): string {
    const key = process.env.ENCRYPTION_KEY;

    if (!key || key.length !== 64) {
        throw new Error(`ENCRYPTION_KEY must be a 32-byte hex string (64 characters). Actual length: ${key?.length || 0}`);
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex');
}

/**
 * Decrypts text encrypted by the above function.
 */
export function decrypt(encryptedData: string): string {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
        throw new Error('ENCRYPTION_KEY must be a 32-byte hex string (64 characters).');
    }

    try {
        const ivHex = encryptedData.substring(0, IV_LENGTH * 2);
        const authTagHex = encryptedData.substring(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2);
        const encryptedTextHex = encryptedData.substring((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encryptedText = Buffer.from(encryptedTextHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
        decipher.setAuthTag(authTag);

        const decrypted = decipher.update(encryptedText) + decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        // Fallback for non-encrypted data (backwards compatibility during migration)
        return encryptedData;
    }
}
