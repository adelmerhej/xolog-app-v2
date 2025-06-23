/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check for existing user by username or email
    const existingUser = await users.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      const conflictField = existingUser.username === username 
        ? "username" 
        : "email";
      return NextResponse.json(
        { error: `User with this ${conflictField} already exists.` },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      profilePicture: "", 
      resetToken: "", 
      tokenExpiryDate: new Date(), 
      role: "user", 
      loginAttempts: 0, 
      lockUntil: null, 
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await users.insertOne(newUser);

    // Return user data without sensitive fields
    const { password: _, resetToken, ...userWithoutSensitiveData } = newUser;

    return NextResponse.json(
      { 
        message: "User registered successfully.",
        user: userWithoutSensitiveData 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
