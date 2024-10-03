import {z} from "zod";

const CreateUserSchema = z.object({ password: z.string() })


export{
    CreateUserSchema
}
