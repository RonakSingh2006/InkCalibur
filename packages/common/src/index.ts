import * as z from "zod"

export const UserSchema = z.object({
  username : z.string().min(5 , "Minimum Length of Username is 5").max(20 , "Maximum Length of Username is 20"),
  password : z.string().min(5 , "Minimum Length of Password is 5"),
  name : z.string().min(3,"Minimum Length is 3").max(15 , "Maximum length of name is 15")
})

export const AuthSchema = z.object({
  username : z.string().min(5 , "Minimum Length of Username is 5").max(20 , "Maximum Length of Username is 20"),
  password : z.string().min(5 , "Minimum Length of Password is 5")
})

export const RoomSchema = z.object({
  name : z.string().min(3 , "Minimum Length of Room name is 3").max(20 , "Maximum Length of Room name is 20")
})

export type User = z.input<typeof UserSchema>
export type Auth = z.input<typeof AuthSchema>
export type Room = z.input<typeof RoomSchema>