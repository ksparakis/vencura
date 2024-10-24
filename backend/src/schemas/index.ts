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

const changeNetworkSchema = z.object({
    network: z.enum(['polygon-testnet', 'sepolia'])
});

// Define the schema for the payload
const payloadSchema = z.object({
    id: z.string(),
    sub: z.string(),
    to: z.string(),
    amount: z.string(),
    status: z.enum(['enqueued', 'processing', 'completed', 'failed']), // Expected statuses
    password: z.string().min(6, 'Password must be at least 6 characters long') // Validate password length
});

// Define the schema for the body
const processTransactionSchema = z.object({
    key: z.literal('sendTransaction'), // Simple validation for key presence
    payload: payloadSchema
});

export{
    passwordSchema,
    signMessageSchema,
    sendTransactionSchema,
    checkTransactionSchema,
    processTransactionSchema,
    changeNetworkSchema
}
