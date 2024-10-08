import {z} from "zod";

const passwordSchema = z.object({ password: z.string() })

// Extend the passwordSchema to include a message field
const signMessageSchema = passwordSchema.extend({
    message: z.string()
});

const sendTransactionSchema = passwordSchema.extend({
    to: z.string().refine(value => /^0x[a-fA-F0-9]{40}$/.test(value), {
        message: "Invalid Ethereum address"
    }),
    amount: z.string().refine(value => !isNaN(parseFloat(value)), {
        message: "Amount must be a valid number"
    })
});

const checkTransactionSchema = z.object({
    transactionId: z.string()
});

export{
    passwordSchema,
    signMessageSchema,
    sendTransactionSchema,
    checkTransactionSchema
}
