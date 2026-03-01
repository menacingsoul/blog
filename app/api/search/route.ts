// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const sortBy = searchParams.get('sort') || 'recent'; // 'recent', 'popular', 'views'

    const skip = (page - 1) * limit;

    const where: any = { published: true };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = { some: { name: { equals: category, mode: 'insensitive' } } };
    }

    if (tag) {
      where.tags = { some: { name: { equals: tag, mode: 'insensitive' } } };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') orderBy = { upVotes: 'desc' };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: { select: { firstName: true, lastName: true, profilePhoto: true } },
          views: true,
          tags: true,
          categories: true,
        },
        orderBy,
        take: limit,
        skip,
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
