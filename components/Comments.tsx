// components/Comments.tsx
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { addComment, addReply, toggleCommentLike } from "@/utils/api";
import {
  MessageSquare, AlertCircle, Send, Reply, ChevronDown,
  ChevronUp, Clock, Heart, Loader2,
} from "lucide-react";
import type { CommentView, ReplyView } from "@/types";

interface CommentsProps {
  blogId: string;
  initialComments: CommentView[];
}

const Comments: React.FC<CommentsProps> = ({ blogId, initialComments }) => {
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

  const commentSectionRef = useRef<HTMLDivElement>(null);

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
    <div ref={commentSectionRef} className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl h-full sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare size={20} /> Comments
          <span className="text-sm font-normal text-gray-400 ml-2">({totalCommentCount})</span>
        </h2>

        {/* Comment Form */}
        <div className="mb-8">
          <div className="relative">
            <textarea value={newComment} onChange={e => { setNewComment(e.target.value); if (commentError) setCommentError(""); }}
              className="w-full p-3 pl-4 pr-12 bg-gray-800/80 text-white rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="Share your thoughts..." rows={3}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(); }} />
            <button onClick={handleAddComment} disabled={isCommenting || !newComment.trim()}
              className={`absolute right-3 bottom-3 p-2 rounded-full ${isCommenting || !newComment.trim() ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"} transition-colors`}>
              {isCommenting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1">Ctrl+Enter to submit</p>
          {commentError && <div className="mt-1 text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} />{commentError}</div>}
        </div>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded-comment">
            {comments.map(comment => {
              const replyCount = getReplyCount(comment);
              const likeCount = getLikeCount(comment);
              const isLiked = likedComments.has(comment.id);
              const authorPhoto = comment.author?.profilePhoto || "/logo.svg";

              return (
                <div key={comment.id} className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Image src={authorPhoto} height={36} width={36} className="rounded-full flex-shrink-0"
                        alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : "Anonymous"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-white font-medium text-sm">
                              {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : "Anonymous"}
                            </div>
                            <div className="text-gray-400 text-xs flex items-center gap-2">
                              <span>@{comment.author?.username || "anonymous"}</span>
                              <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                              <span className="flex items-center gap-1"><Clock size={12} />{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 mt-2 text-sm leading-relaxed">{comment.content}</p>

                        {/* Comment actions */}
                        <div className="mt-3 flex items-center gap-4">
                          <button onClick={() => handleLikeComment(comment.id)}
                            className={`text-xs flex items-center gap-1 transition-colors ${isLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"}`}>
                            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                            <span>{likeCount > 0 ? likeCount : "Like"}</span>
                          </button>
                          <button onClick={() => toggleReplying(comment.id)}
                            className={`text-xs flex items-center gap-1 ${replyingTo === comment.id ? "text-purple-400" : "text-gray-400 hover:text-purple-400"} transition-colors`}>
                            <Reply size={14} /><span>{replyingTo === comment.id ? "Cancel" : "Reply"}</span>
                          </button>
                          {replyCount > 0 && (
                            <button onClick={() => handleShowReplies(comment.id)}
                              className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1">
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
                          className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Write a reply..." rows={2}
                          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply(comment.id); }} />
                        <button onClick={() => handleAddReply(comment.id)}
                          disabled={isReplying || !(replyContent[comment.id] || "").trim()}
                          className={`absolute right-3 bottom-3 p-2 rounded-full ${isReplying ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"} transition-colors`}>
                          {isReplying ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                        {replyError && <div className="mt-1 text-red-400 text-sm flex items-center gap-1"><AlertCircle size={14} />{replyError}</div>}
                      </div>
                    )}
                  </div>

                  {/* Replies section */}
                  {expandedComments.has(comment.id) && loadedReplies[comment.id] && (
                    <div className="border-t border-gray-700/50 bg-gray-800/30">
                      <div className="ml-6 space-y-0 divide-y divide-gray-700/30">
                        {loadedReplies[comment.id].map(reply => {
                          const replyPhoto = reply.author?.profilePhoto || "/logo.svg";
                          return (
                            <div key={reply.id} className="p-4 pl-6">
                              <div className="flex items-start gap-3">
                                <Image src={replyPhoto} height={28} width={28} className="rounded-full flex-shrink-0"
                                  alt={reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : "Anonymous"} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : "Anonymous"}</span>
                                    <span className="text-gray-500 text-xs">@{reply.author?.username || "anonymous"}</span>
                                    <span className="text-gray-500 text-xs flex items-center gap-1"><Clock size={10} />{formatTimeAgo(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm mt-1 leading-relaxed">{reply.content}</p>
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
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
