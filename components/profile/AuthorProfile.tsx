"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Globe, Calendar, Users, BookOpen, ThumbsUp,
  EyeIcon, UserPlus, UserCheck, Loader2, FileEdit, LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { followUser, unFollowUser } from "@/utils/api";
import { cn } from "@/lib/utils";
import { estimateReadingTime } from "@/utils/readingTime";

interface AuthorBlog {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
  upVotes: number;
  views: any[];
  tags: { id: string; name: string }[];
  author: { firstName: string; lastName: string | null; profilePhoto: string | null };
  content: string;
}

interface AuthorFollower {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  profilePhoto: string | null;
}

interface AuthorData {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  profilePhoto: string | null;
  createdAt: Date;
  followers: AuthorFollower[];
  following: AuthorFollower[];
  posts: AuthorBlog[];
}

interface AuthorProfileProps {
  author: AuthorData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  currentUserId: string;
  drafts?: AuthorBlog[];
}

const AuthorProfile: React.FC<AuthorProfileProps> = ({
  author, isOwnProfile, isFollowing: initialFollowing, currentUserId, drafts = [],
}) => {
  const [isFollower, setIsFollower] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(author.followers.length);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"stories" | "drafts">("stories");

  const avatarUrl = author.profilePhoto ||
    `https://eu.ui-avatars.com/api/?name=${author.firstName}+${author.lastName || ""}&color=7F9CF5&background=EBF4FF`;

  const totalViews = author.posts.reduce((sum, p) => sum + p.views.length, 0);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollower) {
        await unFollowUser(author.id);
        setFollowerCount((c) => c - 1);
      } else {
        await followUser(author.id);
        setFollowerCount((c) => c + 1);
      }
      setIsFollower(!isFollower);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long" });

  const formatShortDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      {/* ======= HEADER SECTION ======= */}
      <div className="border-b border-border/50">
        <div className="max-w-[720px] mx-auto px-5 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            {/* Avatar */}
            <Image
              src={avatarUrl}
              height={88}
              width={88}
              alt={`${author.firstName} ${author.lastName || ""}`}
              className="rounded-full object-cover ring-1 ring-border flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {author.firstName} {author.lastName}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">@{author.username}</p>
                </div>

                {/* Follow / Edit button */}
                {!isOwnProfile ? (
                  <button
                    onClick={handleFollowToggle}
                    disabled={loading}
                    className={cn(
                      "py-2.5 px-6 text-sm rounded-full transition-all font-medium flex items-center gap-2 flex-shrink-0",
                      loading ? "bg-muted text-muted-foreground" :
                      isFollower
                        ? "bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-border"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isFollower ? (
                      <><UserCheck size={16} />Following</>
                    ) : (
                      <><UserPlus size={16} />Follow</>
                    )}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/profile/edit"
                      className="py-2.5 px-6 text-sm rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border font-medium transition-all flex-shrink-0"
                    >
                      Edit profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="p-2.5 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-all flex-shrink-0"
                      title="Log out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              {author.bio && (
                <p className="text-foreground/80 mt-4 text-[15px] leading-relaxed max-w-lg">
                  {author.bio}
                </p>
              )}

              {/* Meta info row */}
              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
                {author.city && author.country && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{author.city}, {author.country}</span>
                  </div>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Globe size={14} />
                    <span>{author.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Joined {formatDate(author.createdAt)}</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-5 text-sm">
                <span className="text-foreground">
                  <strong>{followerCount}</strong>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </span>
                <span className="text-foreground">
                  <strong>{author.following.length}</strong>{" "}
                  <span className="text-muted-foreground">Following</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= TABS ======= */}
      <div className="border-b border-border/50 sticky top-16 bg-background z-30">
        <div className="max-w-[720px] mx-auto px-5 flex gap-8">
          <button
            onClick={() => setActiveTab("stories")}
            className={cn(
              "py-4 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === "stories"
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Stories
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("drafts")}
              className={cn(
                "py-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2",
                activeTab === "drafts"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Drafts
              {drafts.length > 0 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{drafts.length}</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ======= CONTENT ======= */}
      <div className="max-w-[720px] mx-auto px-5 py-10">
        {activeTab === "stories" && (
          <div>
            {author.posts.length > 0 ? (
              <div className="divide-y divide-border/50">
                {author.posts.map((blog) => {
                  const readTime = estimateReadingTime(blog.content);
                  return (
                    <article key={blog.id} className="py-8 first:pt-0 last:pb-0">
                      <div className="flex gap-6">
                        {/* Text content */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/blog/viewer/${blog.id}`}
                            className="block group"
                          >
                            <h2 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {blog.title}
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-3">
                              {blog.description || blog.content.replace(/<[^>]*>/g, "").substring(0, 160)}
                            </p>
                          </Link>

                          <div className="flex items-center gap-3 text-[13px] text-muted-foreground flex-wrap">
                            <span>{formatShortDate(blog.createdAt)}</span>
                            {readTime > 0 && (
                              <>
                                <span>·</span>
                                <span>{readTime} min read</span>
                              </>
                            )}
                            {blog.views.length > 0 && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <EyeIcon size={13} />{blog.views.length}
                                </span>
                              </>
                            )}
                            {blog.upVotes > 0 && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp size={13} />{blog.upVotes}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {blog.tags.slice(0, 3).map((tag) => (
                                <Link
                                  key={tag.id}
                                  href={`/blog/blogs?search=${encodeURIComponent(tag.name)}`}
                                  className="px-3 py-1 bg-muted/50 hover:bg-muted text-muted-foreground text-xs rounded-full transition-colors"
                                >
                                  {tag.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Thumbnail */}
                        {blog.imageUrl && (
                          <Link
                            href={`/blog/viewer/${blog.id}`}
                            className="flex-shrink-0 hidden sm:block"
                          >
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded overflow-hidden">
                              <Image
                                src={blog.imageUrl}
                                fill
                                className="object-cover"
                                alt={blog.title}
                              />
                            </div>
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-lg">No stories published yet</p>
                <p className="text-muted-foreground/60 text-sm mt-1">
                  When {author.firstName} publishes, their stories will show up here.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "drafts" && isOwnProfile && (
          <div>
            {drafts.length > 0 ? (
              <div className="divide-y divide-border/50">
                {drafts.map((blog) => {
                  const readTime = estimateReadingTime(blog.content);
                  return (
                    <article key={blog.id} className="py-8 first:pt-0 last:pb-0">
                      <div className="flex gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded">
                              Draft
                            </span>
                          </div>
                          <Link
                            href={`/blog/editor/${blog.id}`}
                            className="block group"
                          >
                            <h2 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {blog.title || "Untitled"}
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-3">
                              {blog.description || blog.content.replace(/<[^>]*>/g, "").substring(0, 160) || "No content yet..."}
                            </p>
                          </Link>
                          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                            <span>Last edited {formatShortDate(blog.createdAt)}</span>
                            {readTime > 0 && (
                              <>
                                <span>·</span>
                                <span>{readTime} min read</span>
                              </>
                            )}
                          </div>
                        </div>
                        {blog.imageUrl && (
                          <Link
                            href={`/blog/editor/${blog.id}`}
                            className="flex-shrink-0 hidden sm:block"
                          >
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded overflow-hidden opacity-70">
                              <Image
                                src={blog.imageUrl}
                                fill
                                className="object-cover"
                                alt={blog.title || "Draft"}
                              />
                            </div>
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <FileEdit size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-lg">No drafts</p>
                <p className="text-muted-foreground/60 text-sm mt-1">
                  Your unpublished stories will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
