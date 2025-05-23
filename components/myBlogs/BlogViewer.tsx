'use client'
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { TwitterShareButton, WhatsappShareButton, TelegramShareButton, FacebookShareButton, TelegramIcon, XIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { handleVote, addComment } from '@/utils/api';
import { 
  EyeIcon, Share2, X, ThumbsUp, ThumbsDown, Copy, 
  Loader2, BookmarkPlus, MessageSquare, Calendar, Users, 
  Heart
} from 'lucide-react';

interface Author {
  profilePhoto: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt?: Date;
}

interface BlogViewerProps {
  blogId: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  author: Author;
  imageUrl: string;
  initialComments: Comment[];
  viewCount: number;
}

const BlogViewer: React.FC<BlogViewerProps> = ({ 
  blogId, title, content, upVotes, downVotes, author, initialComments, viewCount, imageUrl
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });
  const [shareDialogBox, setShareDialogBox] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState({ up: false, down: false });

  const shareUrl = `https://blogfiles.vercel.app/blog/viewer/${blogId}`;
  const shareTitle = title;

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const onVote = async (voteType: 'upvote' | 'downvote') => {
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

  const onShareClick = () => {
    setShareDialogBox(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  const onAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsCommenting(true);
    try {
      const comment = await addComment(blogId, newComment.trim());
      setComments([...comments, comment.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-6 px-4 sm:px-6 relative">
      {/* Background blobs */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-80 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
      
      {/* Share Dialog */}
      {shareDialogBox && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-white">Share this article</h3>
              <button 
                onClick={() => setShareDialogBox(false)}
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
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl">
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
                    onClick={onShareClick}
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
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <EyeIcon size={16} />
                      <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageSquare size={16} />
                      <span>{comments.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar size={16} />
                      <span>Recently</span>
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
                        onClick={() => onVote('upvote')} 
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
                        onClick={() => onVote('downvote')} 
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
                      onClick={onShareClick}
                      className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments Column */}
          <div className="w-full lg:w-4/12">
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl shadow-xl h-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comments
                  <span className="text-sm font-normal text-gray-400 ml-2">({comments.length})</span>
                </h2>
                
                {/* Comment Form */}
                <div className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 bg-gray-800/80 text-white rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Share your thoughts..."
                    rows={3}
                  />
                  <button 
                    onClick={onAddComment}
                    disabled={isCommenting}
                    className={`mt-2 py-2 px-4 rounded-lg flex items-center justify-center gap-2 w-full ${
                      isCommenting 
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } transition-colors`}
                  >
                    {isCommenting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={16} />
                        <span>Post Comment</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Image
                            src={comment.author?.profilePhoto || '/default-avatar.png'}
                            height={36}
                            width={36}
                            className="rounded-full"
                            alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Anonymous'}
                          />
                          <div>
                            <div className="text-white font-medium">
                              {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'You'}
                            </div>
                            <div className="text-gray-400 text-xs flex items-center gap-2">
                              <span>@{comment.author ? comment.author.username : 'you'}</span>
                              {comment.createdAt && (
                                <>
                                  <span className="inline-block w-1 h-1 bg-gray-500 rounded-full"></span>
                                  <span>{formatDate(comment.createdAt)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 mt-1">{comment.content}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1">
                            <Heart size={14} />
                            <span>Like</span>
                          </button>
                          <button className="text-gray-400 hover:text-purple-400 transition-colors text-xs flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/30 rounded-lg p-6 text-center border border-dashed border-gray-700">
                    <Users className="mx-auto text-gray-500 mb-2" size={24} />
                    <p className="text-gray-400">Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the checkmark icon
const Check = (props: any) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default BlogViewer;
