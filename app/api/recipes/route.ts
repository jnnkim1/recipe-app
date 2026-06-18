import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const recipes = await db.collection("recipes").find({ userId: token.sub }).toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const recipeName = formData.get("recipeName") as string;
    const description = formData.get("description") as string;
    const recipeImage = formData.get("recipeImage") as File | null;

    if (!recipeName || !description) {
      return NextResponse.json(
        { error: "Recipe name and description are required" },
        { status: 400 }
      );
    }

    let imageData = null;
    if (recipeImage) {
      const buffer = await recipeImage.arrayBuffer();
      imageData = Buffer.from(buffer).toString("base64");
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("recipes").insertOne({
      recipeName,
      description,
      image: imageData,
      imageFileName: recipeImage?.name,
      ingredients: [],
      instructions: [],
      createdBy: token.username,
      userId: token.sub,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      insertedId: result.insertedId,
      recipeName: recipeName
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipeId, ingredients, instructions } = body;

    if (!recipeId) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const updateData: any = {};
    if (ingredients) {
      updateData.ingredients = ingredients;
    }
    if (instructions) {
      updateData.instructions = instructions;
    }

    const result = await db.collection("recipes").updateOne(
      { _id: new ObjectId(recipeId), userId: token.sub },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Recipe not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
