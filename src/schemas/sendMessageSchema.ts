import * as z from 'zod';



export const SendMessageSchema = z.object({
  username: z.string({ message: 'Username is required' }),
  content: z.string({ message: 'Message content is required' }),
});
