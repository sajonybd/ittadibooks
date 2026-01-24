import { connectDb } from "@/lib/connectDb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const newUser = await request.json();

    if (!newUser || !newUser.email || !newUser.password) {
      return NextResponse.json(
        { message: "Missing user details" },
        { status: 400 }
      );
    }

    const db = await connectDb();
    const userCollection = db.collection("users");

    const normalizedEmail = newUser.email.trim().toLowerCase();

    const existingUser = await userCollection.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = bcrypt.hashSync(newUser.password, 14);

    const userToSave = {
      ...newUser,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    };

    await userCollection.insertOne(userToSave);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    // // // console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating the user" },
      { status: 500 }
    );
  }
};
