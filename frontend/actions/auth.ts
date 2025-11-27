"use server"
import { z } from "zod"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { SigninFormSchema, SignupFormSchema, type FormState } from "@/validations/auth"
import { loginUserService, registerUserService } from "@/lib/strapi"

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week,
  path: '/',
  httpOnly: true, // only accessible by the server
  domain: process.env.HOST ?? 'localhost',
  secure: process.env.NODE_ENV === 'production',
}

export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log('Hello from Register User Action')

  const fields = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    email: formData.get('email') as string,
  }

  const validatedFields = SignupFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error)

    console.log("Validation errors:", flattenedErrors.fieldErrors)

    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: fields
    }
  }

  const response = await registerUserService(validatedFields.data)

  if (!response || response.error) {
    return {
      success: false,
      message: "Registration error",
      strapiErrors: response?.error,
      zodErrors: null,
      data: fields
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt', response.jwt, cookieConfig)
  redirect('/dashboard')
}


export async function loginUserAction(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log('Hello from Login User Action')

  const fields = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  
  const validatedFields = SigninFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error)

    console.log("Validation errors:", flattenedErrors.fieldErrors)
    
    return {
      success: false,
      message: "Validation error",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: fields
    }
  }

  // Map email to identifier for Strapi API
  const strapiData = {
    identifier: validatedFields.data.email,
    password: validatedFields.data.password,
  }
  
  const response = await loginUserService(strapiData)

  if (!response || response.error) {
    return {
      success: false,
      message: "Login error",
      strapiErrors: response?.error,
      zodErrors: null,
      data: fields
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt', response.jwt, cookieConfig)
  redirect('/dashboard')
} 
