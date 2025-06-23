'use server';

import { RegisterSchema } from "@/schemas";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const register = async (values: import("zod").infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input", success: "" };
  }

  const { username, email, password, profilePicture, resetToken, 
    tokenExpiryDate, role, loginAttempts, lockUntil } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return { error: "Email already in use", success: "" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      resetToken,
      tokenExpiryDate,
      role,
      loginAttempts,
      lockUntil,
      createdAt: new Date()
    });

    return { error: "", success: "Account created!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong", success: "" };
  }
};
