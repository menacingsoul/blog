// components/Comments.tsx
'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { addComment, addReply } from '@/utils/api';
import { 
  MessageSquare, AlertCircle, Send, Reply, ChevronDown, 
  ChevronUp, MoreHorizontal, Clock, Heart, Loader2 
} from 'lucide-react';

interface Author {
  profilePhoto: string;
  username: string;
  firstName: string;
  lastName: string;
  id: string;
}

interface Reply {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  replies?: Reply[];
}

interface CommentsProps {
  blogId: string;
  initialComments: Comment[];
  onCommentsUpdate?: (comments: Comment[]) => void;
}

const Comments: React.FC<CommentsProps> = ({ blogId, initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [replyError, setReplyError] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const replyInputRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    setCommentError('');
    setIsCommenting(true);
    
    try {
      const result = await addComment(blogId, newComment.trim());
      setComments([...comments, result.comment]);
      setNewComment('');
      // Scroll to comments section
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      setReplyError('Reply cannot be empty');
      return;
    }
    
    setReplyError('');
    setIsReplying(true);
    
    try {
      const result = await addReply(blogId, replyContent.trim(), commentId);
      
      // Update comments state with the new reply
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), result.reply]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setReplyContent('');
      setReplyingTo(null);
      
      // Ensure the comment with replies is expanded
      setExpandedComments(prev => {
        const updated = new Set(prev);
        updated.add(commentId);
        return updated;
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      setReplyError('Failed to post reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  const toggleReplying = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyContent('');
    setReplyError('');
  };

  const toggleExpandComment = (commentId: string) => {
    setExpandedComments(prev => {
      const updated = new Set(prev);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      return updated;
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000; // seconds in a year
    if (interval > 1) return Math.floor(interval) + 'y ago';
    
    interval = seconds / 2592000; // seconds in a month
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    
    interval = seconds / 86400; // seconds in a day
    if (interval > 1) return Math.floor(interval) + 'd ago';
    
    interval = seconds / 3600; // seconds in an hour
    if (interval > 1) return Math.floor(interval) + 'h ago';
    
    interval = seconds / 60; // seconds in a minute
    if (interval > 1) return Math.floor(interval) + 'm ago';
    
    return Math.floor(seconds) + 's ago';
  };

  const totalCommentCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div ref={commentSectionRef} className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl h-full sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <MessageSquare size={20} />
          Comments
          <span className="text-sm font-normal text-gray-400 ml-2">({totalCommentCount})</span>
        </h2>
        
        {/* Comment Form */}
        <div className="mb-8">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                if (commentError) setCommentError('');
              }}
              className="w-full p-3 pl-4 pr-12 bg-gray-800/80 text-white rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Share your thoughts..."
              rows={3}
            />
            <button 
              onClick={handleAddComment}
              disabled={isCommenting || !newComment.trim()}
              className={`absolute right-3 bottom-3 p-2 rounded-full ${
                isCommenting || !newComment.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } transition-colors`}
            >
              {isCommenting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          {commentError && (
            <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {commentError}
            </div>
          )}
        </div>
        
        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                {/* Main comment */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src={comment.author?.profilePhoto || '/default-avatar.png'}
                      height={36}
                      width={36}
                      className="rounded-full"
                      alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Anonymous'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-white font-medium">
                            {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Anonymous'}
                          </div>
                          <div className="text-gray-400 text-xs flex items-center gap-2">
                            <span>@{comment.author ? comment.author.username : 'anonymous'}</span>
                            <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-500">
                          <button className="hover:text-gray-300 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 mt-2">{comment.content}</p>
                      
                      {/* Comment actions */}
                      <div className="mt-3 flex items-center gap-4">
                        <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1">
                          <Heart size={14} />
                          <span>Like</span>
                        </button>
                        <button 
                          onClick={() => toggleReplying(comment.id)}
                          className={`text-xs flex items-center gap-1 ${
                            replyingTo === comment.id 
                              ? 'text-purple-400' 
                              : 'text-gray-400 hover:text-purple-400'
                          } transition-colors`}
                        >
                          <Reply size={14} />
                          <span>{replyingTo === comment.id ? 'Cancel' : 'Reply'}</span>
                        </button>
                        
                        {/* Show reply count if there are any */}
                        {comment.replies && comment.replies.length > 0 && (
                          <button 
                            onClick={() => toggleExpandComment(comment.id)}
                            className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1"
                          >
                            {expandedComments.has(comment.id) ? (
                              <>
                                <ChevronUp size={14} />
                                <span>Hide replies</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} />
                                <span>Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Reply input */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 ml-10 relative">
                      <textarea
                        ref={el => { replyInputRefs.current[comment.id] = el; }}
                        value={replyContent}
                        onChange={(e) => {
                          setReplyContent(e.target.value);
                          if (replyError) setReplyError('');
                        }}
                        className="w-full p-3 pl-4 pr-12 bg-gray-800 text-white rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Write a reply..."
                        rows={2}
                      />
                      <button 
                        onClick={() => handleAddReply(comment.id)}
                        disabled={isReplying || !replyContent.trim()}
                        className={`absolute right-3 bottom-3 p-2 rounded-full ${
                          isReplying || !replyContent.trim()
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } transition-colors`}
                      >
                        {isReplying ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                      {replyError && (
                        <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
                          <AlertCircle size={14} />
                          {replyError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Replies section */}
                {comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
                  <div className="bg-gray-900/60 border-t border-gray-700/60 pt-1">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="p-3 pl-6 border-l-2 border-purple-500/30 ml-6 my-2">
                        <div className="flex items-start gap-3">
                          <Image
                            src={reply.author?.profilePhoto || '/default-avatar.png'}
                            height={28}
                            width={28}
                            className="rounded-full"
                            alt={reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : 'Anonymous'}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="text-white font-medium">
                                  {reply.author ? `${reply.author.firstName} ${reply.author.lastName}` : 'Anonymous'}
                                </div>
                                <div className="text-gray-400 text-xs flex items-center gap-2">
                                  <span>@{reply.author ? reply.author.username : 'anonymous'}</span>
                                  <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-300 mt-1">{reply.content}</p>
                            
                            {/* Reply actions */}
                            <div className="mt-2 flex items-center gap-4">
                              <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1">
                                <Heart size={12} />
                                <span>Like</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;