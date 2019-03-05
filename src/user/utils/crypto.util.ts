import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * Crypto util
 */
@Injectable()
export class CryptoUtil {

    /**
     * Encrypt the password
     *
     * @param password password
     */
    async encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, bcrypt.genSaltSync());
    }

    /**
     * Check if the password is correct
     *
     * @param password password
     * @param passwordHash password of hash
     */
    async checkPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}