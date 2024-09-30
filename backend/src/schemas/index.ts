import {z} from "zod";

const createUserSchema = z.object({ password: z.string() })


export {
    createUserSchema
}
