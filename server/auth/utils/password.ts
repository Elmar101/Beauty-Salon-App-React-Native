import crypto from 'crypto';

export const generateSalt = (): string => {
    return crypto.randomBytes(16).toString('hex');
}

export const hashPassword = (password: string, salt: string): string => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export const comparePassword = (password: string, salt: string, storeHash: string,): boolean => {
    return hashPassword(password, salt) === storeHash;
}