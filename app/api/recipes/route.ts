// app/api/recipes/route.ts
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const recipes = await db.collection("recipes").find({}).toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const data = await request.json();

    const result = await db.collection("recipes").insertOne(data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
