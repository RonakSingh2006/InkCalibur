import * as z from "zod"

export const UserSchema = z.object({
  username : z.string().min(5 , "Minimum Length of Username is 5").max(20 , "Maximum Length of Username is 20"),
  password : z.string().min(5 , "Minimum Length of Password is 5"),
  name : z.string().min(3,"Minimum Length is 3").max(15 , "Maximum length of name is 15")
})

export const EmailSchema = z.object({
  email: z.email("Invalid email format"),
})

export const OtpSchema = z.object({
  email: z.email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export const SignupSchema = z.object({
  email: z.email("Invalid email format"),
  name: z.string().min(3, "Minimum Length is 3").max(15, "Maximum length of name is 15"),
  username: z.string().min(5, "Minimum Length of Username is 5").max(20, "Maximum Length of Username is 20"),
  password: z.string().min(5, "Minimum Length of Password is 5"),
  confirmPassword: z.string().min(5, "Minimum Length of Password is 5"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const AuthSchema = z.object({
  login: z.string().min(1, "Email or Username is required"),
  password: z.string().min(5, "Minimum Length of Password is 5"),
})

export const RoomSchema = z.object({
  name : z.string().min(3 , "Minimum Length of Room name is 3").max(20 , "Maximum Length of Room name is 20")
})

export type User = z.input<typeof UserSchema>
export type Email = z.input<typeof EmailSchema>
export type Otp = z.input<typeof OtpSchema>
export type Signup = z.input<typeof SignupSchema>
export type Auth = z.input<typeof AuthSchema>
export type Room = z.input<typeof RoomSchema>
