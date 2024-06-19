import { z } from 'zod';


export const messageSchema = z.object({
    identifire: z.string(),
    password: z.string(),
});