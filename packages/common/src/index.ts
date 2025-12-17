import * as z from "zod"

export const UserSchema = z.object({
  username : z.string().min(5).max(20),
  password : z.string().min(5),
  name : z.string().max(15)
})

export const AuthSchema = z.object({
  username : z.string().min(5).max(20),
  password : z.string()
})

export const RoomSchema = z.object({
  name : z.string().min(3).max(20)
})