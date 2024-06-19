import { z } from 'zod';



export const usernameValidation = z
    .string()
    .min(2, { message: 'username must be at least 2 characters long' })
    .max(30, { message: 'username must be less than 30 characters long' })
    .regex(/^[a-zA-Z0-9_]*$/, { message: 'username must be alphanumeric' });



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'invalid email' }),
    password: z.string().min(6),
    passwordConfirmation: z.string().min(6, { message: 'passwords do not match' }),
    // isAcceptingMessages: z.boolean()
});

