// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = await getDB("recipe-app");

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
