export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home/:path*",
    "/blog/editor/:path*",
    "/blog/analytics/:path*",
    "/new-user/:path*",
    "/profile/:path*",
    "/bookmarks/:path*",
    "/settings/:path*",
    "/notifications/:path*",
    "/api/blog/:path*",
    "/api/profile/:path*",
    "/api/comments/:path*",
  ],
};