import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// as script is callback base rather than promise based
// so we convert into one using promisify so that we can
// use async-await.
const scryptAsync = promisify(scrypt);

export class Password {
  // Hash the password
  static async toHash(password: string) {
    // creating salt
    const salt = randomBytes(8).toString('hex');
    // TS is unable to know that this line is :
    // await scryptAsync(password, salt, 64)
    // therefore we wrap it as:
    // (await scryptAsync(password, salt, 64)) as Buffer
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  // Compare the supplied hash password with the stored password
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
