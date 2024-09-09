import * as bcrypt from 'bcrypt';

async function saltAndHashPassword(password: string) {
    try {
        // Generate a salt with a high cost factor (12 is common for strong security)
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error salting and hashing password:', error);
        throw new Error('Password hashing failed');
    }
}

export { saltAndHashPassword };