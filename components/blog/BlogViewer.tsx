// components/BlogViewer.tsx
'use client'
import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { TwitterShareButton, WhatsappShareButton, TelegramShareButton, FacebookShareButton, TelegramIcon, XIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { handleVote, addComment, followUser, unFollowUser, addReply } from '@/utils/api';
import { 
  EyeIcon, Share2, X, ThumbsUp, ThumbsDown, Copy, 
  Loader2, BookmarkPlus, MessageSquare, Calendar, Users, 
  Heart, AlertCircle, CornerDownRight, Send, Reply, ChevronDown, ChevronUp, MoreHorizontal, Clock
} from 'lucide-react';
import Comments from '../Comments';

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

interface BlogViewerProps {
  blogId: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  author: Author;
  createdAt: Date;
  imageUrl: string;
  initialComments: Comment[];
  viewCount: number;
  followButton: boolean;
  unfollow: boolean;
}

const BlogViewer: React.FC<BlogViewerProps> = ({
  blogId, title, content, upVotes, downVotes, author, initialComments, viewCount, imageUrl, followButton, unfollow, createdAt
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  // const [newComment, setNewComment] = useState('');
  // const [replyingTo, setReplyingTo] = useState<string | null>(null);
  // const [replyContent, setReplyContent] = useState('');
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isFollower, setIsFollower] = useState(unfollow);
  const [loading, setLoading] = useState(false);
  // const [isCommenting, setIsCommenting] = useState(false);
  // const [isReplying, setIsReplying] = useState(false);
  const [copied, setCopied] = useState(false);
  // const [commentError, setCommentError] = useState('');
  // const [replyError, setReplyError] = useState('');
  const [hasVoted, setHasVoted] = useState({ up: false, down: false });
  // const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  const commentSectionRef = useRef<HTMLDivElement>(null);
  // const replyInputRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});

  const shareUrl = `https://blogfiles.vercel.app/blog/viewer/${blogId}`;
  const shareTitle = title;

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Scroll to reply input when replying
  // useEffect(() => {
  //   if (replyingTo && replyInputRefs.current[replyingTo]) {
  //     replyInputRefs.current[replyingTo]?.focus();
  //   }
  // }, [replyingTo]);

  const handleVoteAction = async (voteType: 'upvote' | 'downvote') => {
    try {
      const updatedBlog = await handleVote(blogId, voteType);
      setVoteCount({
        upvotes: updatedBlog.blog.upVotes,
        downvotes: updatedBlog.blog.downVotes,
      });

      // Set which button was clicked for visual feedback
      setHasVoted({
        up: voteType === 'upvote',
        down: voteType === 'downvote'
      });

      // Reset after 1 second for UI feedback
      setTimeout(() => {
        setHasVoted({ up: false, down: false });
      }, 1000);
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  // const handleAddComment = async () => {
  //   if (!newComment.trim()) {
  //     setCommentError('Comment cannot be empty');
  //     return;
  //   }
    
  //   setCommentError('');
  //   setIsCommenting(true);
    
  //   try {
  //     const result = await addComment(blogId, newComment.trim());
  //     setComments([...comments, result.comment]);
  //     setNewComment('');
  //     // Scroll to comments section
  //     commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   } catch (error) {
  //     console.error('Error adding comment:', error);
  //     setCommentError('Failed to post comment. Please try again.');
  //   } finally {
  //     setIsCommenting(false);
  //   }
  // };

  // const handleAddReply = async (commentId: string) => {
  //   if (!replyContent.trim()) {
  //     setReplyError('Reply cannot be empty');
  //     return;
  //   }
    
  //   setReplyError('');
  //   setIsReplying(true);
    
  //   try {
  //     const result = await addReply(blogId, replyContent.trim(), commentId);
      
  //     // Update comments state with the new reply
  //     const updatedComments = comments.map(comment => {
  //       if (comment.id === commentId) {
  //         return {
  //           ...comment,
  //           replies: [...(comment.replies || []), result.reply]
  //         };
  //       }
  //       return comment;
  //     });
      
  //     setComments(updatedComments);
  //     setReplyContent('');
  //     setReplyingTo(null);
      
  //     // Ensure the comment with replies is expanded
  //     setExpandedComments(prev => {
  //       const updated = new Set(prev);
  //       updated.add(commentId);
  //       return updated;
  //     });
  //   } catch (error) {
  //     console.error('Error adding reply:', error);
  //     setReplyError('Failed to post reply. Please try again.');
  //   } finally {
  //     setIsReplying(false);
  //   }
  // };

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollower) {
        await unFollowUser(author.id);
      } else {
        await followUser(author.id);
      }
      setIsFollower(!isFollower);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  // const toggleReplying = (commentId: string) => {
  //   setReplyingTo(replyingTo === commentId ? null : commentId);
  //   setReplyContent('');
  //   setReplyError('');
  // };

  // const toggleExpandComment = (commentId: string) => {
  //   setExpandedComments(prev => {
  //     const updated = new Set(prev);
  //     if (updated.has(commentId)) {
  //       updated.delete(commentId);
  //     } else {
  //       updated.add(commentId);
  //     }
  //     return updated;
  //   });
  // };

  const totalCommentCount = comments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-6 px-4 sm:px-6 relative">
      {/* Background elements */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-80 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      
      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-white">Share this article</h3>
              <button 
                onClick={() => setShareDialogOpen(false)}
                className="p-1 rounded-full hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-5">
              <p className="text-gray-300 text-sm font-medium truncate">{title}</p>
            </div>
            
            <div className="flex justify-center gap-6 mb-6">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                    <XIcon size={22} round />
                  </div>
                  <span className="text-xs text-gray-400">Twitter</span>
                </div>
              </TwitterShareButton>
              
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                    <WhatsappIcon size={22} round />
                  </div>
                  <span className="text-xs text-gray-400">WhatsApp</span>
                </div>
              </WhatsappShareButton>
              
              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                    <TelegramIcon size={22} round />
                  </div>
                  <span className="text-xs text-gray-400">Telegram</span>
                </div>
              </TelegramShareButton>
              
              <FacebookShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                    <FacebookIcon size={22} round />
                  </div>
                  <span className="text-xs text-gray-400">Facebook</span>
                </div>
              </FacebookShareButton>
            </div>
            
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-1 ml-1">Copied to clipboard!</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Article Column */}
          <div className="w-full lg:w-8/12">
            {/* Article Card */}
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl mb-6">
              {/* Cover Image */}
              <div className="relative w-full h-72 overflow-hidden">
                <Image
                  src={imageUrl}
                  fill
                  className="object-cover"
                  alt={title}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                
                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={handleShareClick}
                    className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full backdrop-blur-sm text-white transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full backdrop-blur-sm text-white transition-colors"
                    aria-label="Bookmark"
                  >
                    <BookmarkPlus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Content Container */}
              <div className="p-6 lg:p-8">
                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">{title}</h1>
                
                {/* Author & Stats */}
                <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-gray-800">
                  {/* Author info */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <Image
                      src={author.profilePhoto}
                      height={48}
                      width={48}
                      alt={`${author.firstName} ${author.lastName}`}
                      className="rounded-full border-2 border-purple-500/30"
                    />
                    <div>
                      <div className="text-white font-medium">{`${author.firstName} ${author.lastName}`}</div>
                      <div className="text-gray-400 text-sm">{`@${author.username}`}</div>
                    </div>
                    
                    {followButton && (
                      <button
                        onClick={handleFollowToggle}
                        disabled={loading}
                        className={`ml-4 py-1.5 px-4 text-sm rounded-full transition-colors ${
                          loading 
                            ? 'bg-gray-700 text-gray-300' 
                            : isFollower 
                              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {loading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : isFollower ? (
                          'Following'
                        ) : (
                          'Follow'
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400" title="Views">
                      <EyeIcon size={16} />
                      <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400" title="Comments">
                      <MessageSquare size={16} />
                      <span>{totalCommentCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400" title="Date published">
                      <Calendar size={16} />
                      <span>
                        {formatDate(createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Article Content */}
                <article className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-blockquote:border-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-2 prose-blockquote:rounded prose-code:text-purple-300 prose-pre:bg-gray-800/70">
                  {parse(content)}
                </article>
                
                {/* Voting Section */}
                <div className="mt-10 pt-6 border-t border-gray-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleVoteAction('upvote')} 
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
                          hasVoted.up 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        } transition-colors`}
                      >
                        <ThumbsUp size={18} />
                        <span>{voteCount.upvotes}</span>
                      </button>
                      <button 
                        onClick={() => handleVoteAction('downvote')} 
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${
                          hasVoted.down 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                        } transition-colors`}
                      >
                        <ThumbsDown size={18} />
                        <span>{voteCount.downvotes}</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleShareClick}
                      className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments Section (on mobile, shows below article) */}
            <div className="lg:hidden w-full">
              <CommentsSection />
            </div>
          </div>
          
          {/* Comments Column (on desktop) */}
          <div className="hidden lg:block lg:w-4/12">
            <CommentsSection />
          </div>
        </div>
      </div>
    </div>
  );
  
  // Comments Section Component (for reuse in both mobile and desktop layouts)
function CommentsSection() {
  return (
    <Comments 
      blogId={blogId}
      initialComments={initialComments}
    />
  );
}}

export default BlogViewer;