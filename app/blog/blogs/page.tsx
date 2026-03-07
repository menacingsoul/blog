import React from 'react';
import { prisma } from '@/utils/db';
import BlogCard from '@/components/cards/BlogCard';
import BlogsSearch from '@/components/blog/BlogSearch';
import { Search } from 'lucide-react';

const Blogs = async ({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) => {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.search || '';
  const page = Number(resolvedSearchParams.page || 1);
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = { published: true };

  let blogs: any[] = [];
  let total = 0;

  if (searchQuery) {
    const { generateEmbedding } = await import('@/utils/embeddings');
    const embedding = await generateEmbedding(searchQuery);

    if (embedding) {
      try {
        const embeddingString = JSON.stringify(embedding);
        const rawBlogs: any[] = await prisma.$queryRaw`
          SELECT id, title, description, content, "imageUrl", "createdAt", "authorId", "upVotes", "downVotes"
          FROM "Blog"
          WHERE published = true AND embedding IS NOT NULL AND (embedding <=> ${embeddingString}::vector) <= 0.55
          ORDER BY embedding <=> ${embeddingString}::vector
          LIMIT ${limit} OFFSET ${skip};
        `;

        const countQuery: any[] = await prisma.$queryRaw`
          SELECT CAST(COUNT(*) AS INTEGER) as total
          FROM "Blog"
          WHERE published = true AND embedding IS NOT NULL AND (embedding <=> ${embeddingString}::vector) <= 0.55;
        `;
        total = countQuery[0]?.total || 0;

        if (rawBlogs.length > 0) {
          const authorIds = rawBlogs.map(b => b.authorId);
          const authors = await prisma.user.findMany({
            where: { id: { in: authorIds } },
            select: { id: true, firstName: true, lastName: true, profilePhoto: true }
          });

          const viewCounts = await prisma.view.groupBy({
            by: ['blogId'],
            where: { blogId: { in: rawBlogs.map(b => b.id) } },
            _count: true
          });

          blogs = rawBlogs.map(b => ({
            ...b,
            author: authors.find(a => a.id === b.authorId) || { firstName: 'Unknown', lastName: '' },
            _count: { views: viewCounts.find(v => v.blogId === b.id)?._count || 0 }
          }));
        }
      } catch (err) {
        console.error("Vector Search failed, using fallback:", err);
      }
    }
    
    // Fallback if no embedding generated, raw query failed, or no vectors matched
    if (blogs.length === 0) {
      // Re-apply the normal text-search logic as a fallback
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { content: { contains: searchQuery, mode: 'insensitive' } },
      ];

      const [fallbackBlogs, fallbackTotal] = await Promise.all([
        prisma.blog.findMany({
          where,
          include: { author: { select: { firstName: true, lastName: true, profilePhoto: true } }, views: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip,
        }),
        prisma.blog.count({ where }),
      ]);
      blogs = fallbackBlogs;
      total = fallbackTotal;
    }
  } else {
    // No search query, just return everything sorted chronologically
    const [allBlogs, allTotal] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: { author: { select: { firstName: true, lastName: true, profilePhoto: true } }, views: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.blog.count({ where }),
    ]);
    blogs = allBlogs;
    total = allTotal;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Search size={28} className="text-primary" />
          Explore Blogs
          {searchQuery && (
            <span className="text-lg font-normal text-muted-foreground">
              — results for &quot;{searchQuery}&quot;
            </span>
          )}
        </h1>

        <BlogsSearch />

        <div className="text-muted-foreground text-sm mb-6">
          {total} {total === 1 ? 'blog' : 'blogs'} found
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog: any) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground glass-card rounded-2xl">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No blogs found</p>
              {searchQuery && (
                <p className="text-sm mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            {page > 1 && (
              <a
                href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm border border-border"
              >
                Previous
              </a>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-muted-foreground px-1">...</span>
                  )}
                  <a
                    href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${p}`}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      p === page
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                    }`}
                  >
                    {p}
                  </a>
                </React.Fragment>
              ))
            }

            {page < totalPages && (
              <a
                href={`/blog/blogs?${searchQuery ? `search=${searchQuery}&` : ''}page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm border border-border"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
