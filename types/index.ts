// types/index.ts
// Central type definitions matching the Prisma schema.
// All components and pages should import from here.

// ─── User ────────────────────────────────────────────────────
export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  clerkId: string;
  email: string;
  website: string | null;
  bio: string;
  registered: boolean;
  city: string;
  country: string;
  profilePhoto: string | null;
  createdAt: Date;
  updatedAt: Date;

  posts: Blog[];
  comments: Comment[];
  votes: Vote[];
  views: View[];
  readingHistory: ReadingHistory[];
  bookmarks: Bookmark[];
  commentLikes: CommentLike[];
  following: User[];
  followers: User[];
  notifications: Notification[];
}

/** Lightweight user for card / avatar display */
export interface UserSummary {
  id?: string;
  firstName: string;
  lastName: string | null;
  profilePhoto: string | null;
  username?: string;
}

/** Full profile card user (profile page) */
export interface ProfileUser {
  firstName: string;
  lastName: string | null;
  username: string;
  email?: string;
  bio: string;
  city: string;
  country: string;
  website: string | null;
  profilePhoto: string | null;
  followers: UserFollower[];
  following: UserFollower[];
  posts: UserPost[];
}

export interface UserFollower {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  profilePhoto: string | null;
}

export interface UserPost {
  id: string;
  title: string;
  published: boolean;
}

// ─── Blog ────────────────────────────────────────────────────
export interface Blog {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  upVotes: number;
  downVotes: number;
  authorId: string;

  author: UserSummary;
  tags: Tag[];
  categories: Category[];
  comments: Comment[];
  votes: Vote[];
  views: View[];
  readingHistory: ReadingHistory[];
  bookmarks: Bookmark[];
  notifications: Notification[];
}

/** Lightweight blog for cards – only the fields cards actually need */
export interface BlogCard {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  views?: View[];
  author: UserSummary;
  _count?: { views: number };
}

/** Blog data for the viewer page */
export interface BlogView {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  upVotes: number;
  downVotes: number;
  author: BlogAuthor;
  comments: CommentView[];
  views: View[];
  tags: Tag[];
}

/** Author info as returned on the blog detail page */
export interface BlogAuthor {
  id: string;
  firstName: string;
  lastName: string | null;
  profilePhoto: string | null;
  username: string;
  followers?: UserFollower[];
}

// ─── Comment ─────────────────────────────────────────────────
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  blogId: string;
  parentId: string | null;

  author: UserSummary;
  replies: Comment[];
  likes: CommentLike[];
}

/** Comment data as used in the viewer / comments component */
export interface CommentView {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
  replies?: ReplyView[];
  repliesCount?: number;
  _count?: { replies: number; likes: number };
}

export interface CommentAuthor {
  id?: string;
  firstName: string;
  lastName: string | null;
  profilePhoto: string | null;
  username: string;
}

export interface ReplyView {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
}

// ─── CommentLike ─────────────────────────────────────────────
export interface CommentLike {
  id: string;
  createdAt: Date;
  userId: string;
  commentId: string;
}

// ─── Notification ────────────────────────────────────────────
export interface Notification {
  id: string;
  type: string;
  userId: string;
  commentId: string | null;
  blogId: string | null;
  createdAt: string | Date;
  read: boolean;
  message: string;
  blog?: { id: string; title: string } | null;
  comment?: { id: string; content: string } | null;
}

// ─── Bookmark ────────────────────────────────────────────────
export interface Bookmark {
  id: string;
  createdAt: Date;
  userId: string;
  blogId: string;
  blog?: BlogCard;
}

// ─── Vote ────────────────────────────────────────────────────
export interface Vote {
  id: string;
  upVote: boolean;
  createdAt: Date;
  userId: string;
  blogId: string | null;
}

// ─── View ────────────────────────────────────────────────────
export interface View {
  id: string;
  createdAt: Date;
  userId: string;
  blogId: string;
}

// ─── Tag & Category ──────────────────────────────────────────
export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  _count?: { blogs: number };
}

// ─── ReadingHistory ──────────────────────────────────────────
export interface ReadingHistory {
  id: string;
  createdAt: Date;
  userId: string;
  blogId: string;
}

// ─── Form Data ───────────────────────────────────────────────
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  username?: string;
  bio: string;
  website: string;
  city: string;
  country: string;
  profilePhoto?: string;
}

// ─── API Responses ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface VoteResponse {
  message: string;
  blog: {
    upVotes: number;
    downVotes: number;
  };
}

export interface BookmarkResponse {
  bookmarked: boolean;
  message: string;
}

export interface CommentLikeResponse {
  liked: boolean;
  likeCount: number;
}
