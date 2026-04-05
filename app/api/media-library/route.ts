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

    // Securely derive username from the authenticated session to prevent enumeration
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });

    if (!user || !user.username) {
      return NextResponse.json({ error: "User profile not found" }, { status: 403 });
    }
    
    const username = user.username;

    // List all images in the user's media_uploads folder
    const folder = `blog/${username}/media_uploads`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?prefix=${encodeURIComponent(folder)}&type=upload&max_results=50&direction=-1`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!cloudinaryRes.ok) {
      console.error("Cloudinary list error:", await cloudinaryRes.text());
      return NextResponse.json({ media: [] });
    }

    const data = await cloudinaryRes.json();
    const media = (data.resources || []).map((r: any) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ media });
  } catch (error) {
    console.error("Error fetching media library:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
