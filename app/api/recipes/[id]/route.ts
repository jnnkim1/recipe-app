import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(id),
      userId: token.sub,
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("recipes").deleteOne({
      _id: new ObjectId(id),
      userId: token.sub,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipe deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const recipeName = String(formData.get("recipeName") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const ingredients = JSON.parse(String(formData.get("ingredients") || "[]"));
    const instructions = JSON.parse(String(formData.get("instructions") || "[]"));
    const recipeImage = formData.get("recipeImage");
    const removeImage = formData.get("removeImage") === "true";

    if (!recipeName || !description) {
      return NextResponse.json(
        { error: "Recipe name and description are required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return NextResponse.json({ error: "Invalid recipe details" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      recipeName,
      description,
      ingredients,
      instructions,
      updatedAt: new Date(),
    };

    if (recipeImage instanceof File && recipeImage.size > 0) {
      const buffer = await recipeImage.arrayBuffer();
      updateData.image = Buffer.from(buffer).toString("base64");
      updateData.imageFileName = recipeImage.name;
    } else if (removeImage) {
      updateData.image = null;
      updateData.imageFileName = null;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("recipes").updateOne(
      { _id: new ObjectId(id), userId: token.sub },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Recipe updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid recipe data" }, { status: 400 });
  }
}
