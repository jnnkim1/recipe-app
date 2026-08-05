import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface RecipeReview {
  review: string;
  image: string | null;
  imageFileName: string | null;
  imageType: string | null;
  userId: string;
  username: string;
  createdAt: Date;
}

interface RecipeWithReviews {
  reviews?: RecipeReview[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const review = String(formData.get("review") || "").trim();
    const dishImage = formData.get("dishImage");

    if (!review) {
      return NextResponse.json({ error: "A review is required" }, { status: 400 });
    }

    let image: string | null = null;
    let imageFileName: string | null = null;
    let imageType: string | null = null;
    if (dishImage instanceof File && dishImage.size > 0) {
      const buffer = await dishImage.arrayBuffer();
      image = Buffer.from(buffer).toString("base64");
      imageFileName = dishImage.name;
      imageType = dishImage.type || "image/jpeg";
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection<RecipeWithReviews>("recipes").updateOne(
      { _id: new ObjectId(id), userId: token.sub },
      {
        $push: {
          reviews: {
            review,
            image,
            imageFileName,
            imageType,
            userId: token.sub || "",
            username: String(token.username || ""),
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
