'use server'

import * as z from 'zod';
import { LoginSchema } from "@/schemas";
import { signIn } from "next-auth/react";

// import bcrypt from 'bcryptjs';
// import { NextResponse } from 'next/server';


export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);

  if (typeof window !== "undefined") {
    // Safe to use window here
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      return { error: "Invalid fields!"};
    }
    if (res?.ok) {
      return { success: "Email sent!"}
    }
  }

  // const res = await signIn("credentials", {
  //   email: values.email,
  //   password: values.password,
  //   redirect: false,
  // });


  if(!validateFields) {
    return { error: "Invalid fields!"}
  }

  return { success: "Email sent!"}
};