import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/utils/db";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the username from query params, or fall back to current user
    const { searchParams } = new URL(req.url);
    let username = searchParams.get("username");

    if (!username) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true },
      });
      username = user?.username || null;
    }

    if (!username) {
      return NextResponse.json({ photos: [] });
    }

    // Use Cloudinary Admin API to list resources in the user's profile_pics folder
    const folder = `blog/${username}/profile_pics`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?prefix=${encodeURIComponent(folder)}&type=upload&max_results=20&direction=-1`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!cloudinaryRes.ok) {
      console.error("Cloudinary list error:", await cloudinaryRes.text());
      return NextResponse.json({ photos: [] });
    }

    const data = await cloudinaryRes.json();
    const photos = (data.resources || []).map((r: any) => ({
      url: r.secure_url,
      publicId: r.public_id,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching profile photos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
