import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
  encrypt(data: string | number) {
    const cipher = createCipheriv('aes-256-ctr', Buffer.from(process.env.ENCRYPTION_KEY, 'base64'), Buffer.from(process.env.ENCRYPTION_IV, 'base64'));
    const stringData = data.toString();
    const encryptedText = Buffer.concat([
      cipher.update(stringData),
      cipher.final()
    ]);

    return encryptedText.toString('base64');
  }

  decrypt(data: string, shouldConvertToNumber = false) {
    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(process.env.ENCRYPTION_KEY, 'base64'), Buffer.from(process.env.ENCRYPTION_IV, 'base64'));
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(data, 'base64')),
      decipher.final()
    ]);

    if (!shouldConvertToNumber) return decryptedText.toString();

    return this.convertString(decryptedText.toString());
  }

  private convertString(input: string) {
    const convertedNumber = Number(input);

    if (!isNaN(convertedNumber)) return convertedNumber;

    return input;
  }
}
