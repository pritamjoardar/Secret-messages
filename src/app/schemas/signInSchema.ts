import { z } from "zod"

export const signInSchema = z.object({
  identifire : z.string(),
  password :  z.string(),
})