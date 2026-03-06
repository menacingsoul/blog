// components/Comments.tsx
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { addComment, addReply, toggleCommentLike, deleteComment } from "@/utils/api";
import {
  MessageSquare, AlertCircle, Send, Reply, ChevronDown,
  ChevronUp, Clock, Heart, Loader2, Trash2,
} from "lucide-react";
import type { CommentView, ReplyView } from "@/types";
import { cn } from "@/lib/utils";

interface CommentsProps {
  blogId: string;
  initialComments: CommentView[];
  currentUserId?: string;
  blogAuthorId?: string;
}

const Comments: React.FC<CommentsProps> = ({ blogId, initialComments, currentUserId, blogAuthorId }) => {
  const [comments, setComments] = useState<CommentView[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [loadedReplies, setLoadedReplies] = useState<Record<string, ReplyView[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [deletingComment, setDeletingComment] = useState<string | null>(null);

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const canDeleteComment = (commentAuthorId?: string) => {
    if (!currentUserId) return false;
    // Comment author can delete their own comment
    if (commentAuthorId && commentAuthorId === currentUserId) return true;
    // Blog post author can delete any comment
    if (blogAuthorId && blogAuthorId === currentUserId) return true;
    return false;
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingComment(commentId);
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {
      // silently fail
    } finally {
      setDeletingComment(null);
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    setDeletingComment(replyId);
    try {
      await deleteComment(replyId);
      setLoadedReplies(prev => ({
        ...prev,
        [commentId]: (prev[commentId] || []).filter(r => r.id !== replyId),
      }));
      setComments(prev => prev.map(c =>
        c.id === commentId ? { ...c, repliesCount: Math.max(0, (c.repliesCount || 1) - 1) } : c
      ));
    } catch {
      // silently fail
    } finally {
      setDeletingComment(null);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) { setCommentError("Comment cannot be empty"); return; }
    setCommentError(""); setIsCommenting(true);
    try {
      const result = await addComment(blogId, newComment.trim());
      setComments([result.comment, ...comments]);
      setNewComment("");
      commentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch { setCommentError("Failed to post comment. Please try again."); }
    finally { setIsCommenting(false); }
  };

  const handleShowReplies = async (commentId: string) => {
    if (loadedReplies[commentId]) {
      setExpandedComments(prev => { const u = new Set(prev); if (u.has(commentId)) u.delete(commentId); else u.add(commentId); return u; });
      return;
    }
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      const res = await fetch(`/api/comments/${commentId}/replies?take=10`);
      const replies = await res.json();
      setLoadedReplies(prev => ({ ...prev, [commentId]: replies }));
      setExpandedComments(prev => new Set(prev).add(commentId));
    } catch { /* silently fail */ }
    finally { setLoadingReplies(prev => ({ ...prev, [commentId]: false })); }
  };

  const handleAddReply = async (commentId: string) => {
    const content = replyContent[commentId] || "";
    if (!content.trim()) { setReplyError("Reply cannot be empty"); return; }
    setReplyError(""); setIsReplying(true);
    try {
      const result = await addReply(blogId, content.trim(), commentId);
      setLoadedReplies(prev => ({ ...prev, [commentId]: [...(prev[commentId] || []), result.reply] }));
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c));
      setReplyContent(prev => ({ ...prev, [commentId]: "" }));
      setReplyingTo(null);
      setExpandedComments(prev => { const u = new Set(prev); u.add(commentId); return u; });
    } catch { setReplyError("Failed to post reply. Please try again."); }
    finally { setIsReplying(false); }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const result = await toggleCommentLike(commentId);
      setLikedComments(prev => { const u = new Set(prev); result.liked ? u.add(commentId) : u.delete(commentId); return u; });
      setLikeCounts(prev => ({ ...prev, [commentId]: result.likeCount }));
    } catch { /* silently fail */ }
  };

  const toggleReplying = (commentId: string) => { setReplyingTo(replyingTo === commentId ? null : commentId); setReplyError(""); };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds >= 31536000) return Math.floor(seconds / 31536000) + "y ago";
    if (seconds >= 2592000) return Math.floor(seconds / 2592000) + "mo ago";
    if (seconds >= 86400) return Math.floor(seconds / 86400) + "d ago";
    if (seconds >= 3600) return Math.floor(seconds / 3600) + "h ago";
    if (seconds >= 60) return Math.floor(seconds / 60) + "m ago";
    return "just now";
  };

  const getReplyCount = (c: CommentView) => c.repliesCount || c._count?.replies || c.replies?.length || 0;
  const getLikeCount = (c: CommentView) => likeCounts[c.id] !== undefined ? likeCounts[c.id] : (c._count?.likes || 0);

  const totalCommentCount = comments.reduce((t, c) => t + 1 + getReplyCount(c), 0);

  return (
    <div ref={commentSectionRef}>
      <div>
        {/* Comment Form */}
        <div className="mb-6">
          <div className="relative">
            <textarea value={newComment} onChange={e => { setNewComment(e.target.value); if (commentError) setCommentError(""); }}
              className="w-full p-3.5 pl-4 pr-12 bg-muted/30 dark:bg-muted/20 text-foreground rounded-xl border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              placeholder="Share your thoughts..." rows={3}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(); }} />
            <button onClick={handleAddComment} disabled={isCommenting || !newComment.trim()}
              className={cn(
                "absolute right-3 bottom-3 p-2 rounded-full transition-all",
                isCommenting || !newComment.trim()
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
              )}>
              {isCommenting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-1.5">Ctrl+Enter to submit</p>
          {commentError && <div className="mt-1 text-destructive text-sm flex items-center gap-1"><AlertCircle size={14} />{commentError}</div>}
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => {
              const replyCount = getReplyCount(comment);
              const likeCount = getLikeCount(comment);
              const isLiked = likedComments.has(comment.id);
              const authorPhoto = comment.author?.profilePhoto || "/logo.svg";
              const showDelete = canDeleteComment(comment.author?.id);
              const isDeleting = deletingComment === comment.id;

              return (
                <div key={comment.id} className={cn(
                  "bg-muted/20 dark:bg-muted/10 rounded-xl border border-border/50 overflow-hidden hover:border-border transition-colors",
                  isDeleting && "opacity-50 pointer-events-none"
                )}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Image src={authorPhoto} height={36} width={36} className="rounded-full flex-shrink-0 ring-1 ring-border"
                        alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : "Anonymous"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-foreground font-medium text-sm">
                              {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : "Anonymous"}
                            </div>
                            <div className="text-muted-foreground text-xs flex items-center gap-2">
                              <span>@{comment.author?.username || "anonymous"}</span>
                              <span className="inline-block w-1 h-1 bg-muted-foreground/50 rounded-full"></span>
                              <span className="flex items-center gap-1"><Clock size={11} />{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                          </div>
                          {showDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={isDeleting}
                              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              title="Delete comment"
                            >
                              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          )}
                        </div>
                        <p className="text-foreground/80 mt-2 text-sm leading-relaxed">{comment.content}</p>

                        {/* Comment actions */}
                        <div className="mt-3 flex items-center gap-4">
                          <button onClick={() => handleLikeComment(comment.id)}
                            className={cn("text-xs flex items-center gap-1 transition-colors",
                              isLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500")}>
                            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                            <span>{likeCount > 0 ? likeCount : "Like"}</span>
                          </button>
                          <button onClick={() => toggleReplying(comment.id)}
                            className={cn("text-xs flex items-center gap-1 transition-colors",
                              replyingTo === comment.id ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                            <Reply size={14} /><span>{replyingTo === comment.id ? "Cancel" : "Reply"}</span>
                          </button>
                          {replyCount > 0 && (
                            <button onClick={() => handleShowReplies(comment.id)}
                              className="text-muted-foreground hover:text-primary transition-colors text-xs flex items-center gap-1">
                              {expandedComments.has(comment.id) ? <><ChevronUp size={14} /><span>Hide replies</span></> : <><ChevronDown size={14} /><span>{replyCount} {replyCount === 1 ? "reply" : "replies"}</span></>}
                              {loadingReplies[comment.id] && <Loader2 size={14} className="animate-spin ml-1" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reply input */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 ml-10 relative">
                        <textarea value={replyContent[comment.id] || ""}
                          onChange={e => { setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value })); if (replyError) setReplyError(""); }}
                          className="w-full p-3 pl-4 pr-12 bg-muted/30 dark:bg-muted/20 text-foreground rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                          placeholder="Write a reply..." rows={2}
                          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply(comment.id); }} />
                        <button onClick={() => handleAddReply(comment.id)}
                          disabled={isReplying || !(replyContent[comment.id] || "").trim()}
                          className={cn(
                            "absolute right-3 bottom-3 p-2 rounded-full transition-all",
                            isReplying ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          )}>
                          {isReplying ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                        {replyError && <div className="mt-1 text-destructive text-sm flex items-center gap-1"><AlertCircle size={14} />{replyError}</div>}
                      </div>
                    )}
                  </div>

                  {/* Replies section */}
                  {expandedComments.has(comment.id) && loadedReplies[comment.id] && (
                    <div className="border-t border-border/50 bg-muted/10">
                      <div className="ml-6 space-y-0 divide-y divide-border/30">
                        {loadedReplies[comment.id].map(reply => {
                          const replyPhoto = reply.author?.profilePhoto || "/logo.svg";
                          const showReplyDelete = canDeleteComment(reply.author?.id);
                          const isReplyDeleting = deletingComment === reply.id;
                          return (
                            <div key={reply.id} className={cn("p-4 pl-6", isReplyDeleting && "opacity-50 pointer-events-none")}>
                              <div className="flex items-start gap-3">
                                <Image src={replyPhoto} height={28} width={28} className="rounded-full flex-shrink-0 ring-1 ring-border"
                                  alt={reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : "Anonymous"} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-foreground font-medium text-sm">{reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : "Anonymous"}</span>
                                      <span className="text-muted-foreground text-xs">@{reply.author?.username || "anonymous"}</span>
                                      <span className="text-muted-foreground text-xs flex items-center gap-1"><Clock size={10} />{formatTimeAgo(reply.createdAt)}</span>
                                    </div>
                                    {showReplyDelete && (
                                      <button
                                        onClick={() => handleDeleteReply(comment.id, reply.id)}
                                        disabled={isReplyDeleting}
                                        className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                        title="Delete reply"
                                      >
                                        {isReplyDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-foreground/80 text-sm mt-1 leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
