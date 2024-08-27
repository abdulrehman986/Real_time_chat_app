import bcrypt from 'bcrypt';

export async function isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
}