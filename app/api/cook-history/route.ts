import clientPromise from "@/lib/mongodb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const history = await db.collection("recipes").aggregate([
      { $match: { userId: token.sub } },
      { $unwind: { path: "$reviews", includeArrayIndex: "reviewIndex" } },
      { $match: { "reviews.userId": token.sub } },
      {
        $project: {
          _id: 0,
          id: { $concat: [{ $toString: "$_id" }, "-", { $toString: "$reviewIndex" }] },
          recipeId: { $toString: "$_id" },
          recipeName: 1,
          review: "$reviews.review",
          image: "$reviews.image",
          imageFileName: "$reviews.imageFileName",
          imageType: "$reviews.imageType",
          completedAt: "$reviews.createdAt",
        },
      },
      { $sort: { completedAt: -1 } },
    ]).toArray();

    return NextResponse.json(history);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load cooking history" },
      { status: 500 }
    );
  }
}
