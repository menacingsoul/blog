// components/blog/BlogViewer.tsx
'use client'
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { TwitterShareButton, WhatsappShareButton, TelegramShareButton, FacebookShareButton, TelegramIcon, XIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { handleVote, followUser, unFollowUser, toggleBookmark } from '@/utils/api';
import { 
  EyeIcon, Share2, X, ThumbsUp, ThumbsDown, Copy,
  Loader2, BookmarkPlus, Bookmark, MessageSquare, Calendar,
  Check, BookOpen, ArrowLeft, Tag as TagIcon
} from 'lucide-react';
import Comments from '../Comments';
import type { BlogAuthor, CommentView, Tag } from '@/types';

interface BlogViewerProps {
  blogId: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  author: BlogAuthor;
  createdAt: Date;
  imageUrl: string;
  initialComments: CommentView[];
  viewCount: number;
  followButton: boolean;
  unfollow: boolean;
  readingTime?: number;
  tags?: Tag[];
}

const BlogViewer: React.FC<BlogViewerProps> = ({
  blogId, title, content, upVotes, downVotes, author, initialComments, viewCount, imageUrl, followButton, unfollow, createdAt, readingTime, tags
}) => {
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isFollower, setIsFollower] = useState(unfollow);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState({ up: false, down: false });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/viewer/${blogId}` : '';
  const shareTitle = title;
  const authorPhoto = author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${author.firstName}+${author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  useEffect(() => { if (copied) { const t = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(t); } }, [copied]);

  const handleVoteAction = async (voteType: 'upvote' | 'downvote') => {
    try {
      const updatedBlog = await handleVote(blogId, voteType);
      if (updatedBlog.blog) setVoteCount({ upvotes: updatedBlog.blog.upVotes, downvotes: updatedBlog.blog.downVotes });
      setHasVoted({ up: voteType === 'upvote', down: voteType === 'downvote' });
      setTimeout(() => setHasVoted({ up: false, down: false }), 1000);
    } catch (error) { console.error('Error handling vote:', error); }
  };

  const handleFollowToggle = async () => {
    setLoading(true);
    try { isFollower ? await unFollowUser(author.id) : await followUser(author.id); setIsFollower(!isFollower); }
    catch (error: any) { console.error(error.message); }
    finally { setLoading(false); }
  };

  const handleBookmark = async () => {
    setBookmarkLoading(true);
    try { const result = await toggleBookmark(blogId); setIsBookmarked(result.bookmarked); }
    catch (error) { console.error('Error bookmarking:', error); }
    finally { setBookmarkLoading(false); }
  };

  const handleCopyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const totalCommentCount = initialComments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-6 px-4 sm:px-6 relative">
      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-gray-900/90 rounded-xl border border-gray-700 shadow-2xl animate-fadeInUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-white">Share this article</h3>
              <button onClick={() => setShareDialogOpen(false)} className="p-1 rounded-full hover:bg-gray-700/70 transition-colors text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-gray-300 text-sm font-medium truncate mb-5">{title}</p>
            <div className="flex justify-center gap-6 mb-6">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><XIcon size={22} round /></div><span className="text-xs text-gray-400">Twitter</span></div>
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><WhatsappIcon size={22} round /></div><span className="text-xs text-gray-400">WhatsApp</span></div>
              </WhatsappShareButton>
              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><TelegramIcon size={22} round /></div><span className="text-xs text-gray-400">Telegram</span></div>
              </TelegramShareButton>
              <FacebookShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"><FacebookIcon size={22} round /></div><span className="text-xs text-gray-400">Facebook</span></div>
              </FacebookShareButton>
            </div>
            <div className="relative">
              <div className="flex">
                <input type="text" value={shareUrl} readOnly className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg text-sm border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <button onClick={handleCopyLink} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              {copied && <p className="text-green-400 text-xs mt-1 ml-1">Copied to clipboard!</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Article Column */}
          <div className="w-full lg:w-8/12">
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-xl mb-6">
              {imageUrl && (
                <div className="relative w-full h-72 overflow-hidden">
                  <Image src={imageUrl} fill className="object-cover" alt={title} priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setShareDialogOpen(true)} className="p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full backdrop-blur-sm text-white transition-colors" aria-label="Share"><Share2 size={18} /></button>
                    <button onClick={handleBookmark} disabled={bookmarkLoading}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isBookmarked ? 'bg-indigo-600/80 text-white' : 'bg-gray-800/80 hover:bg-gray-700 text-white'}`} aria-label="Bookmark">
                      {bookmarkLoading ? <Loader2 size={18} className="animate-spin" /> : isBookmarked ? <Bookmark size={18} /> : <BookmarkPlus size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                      <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-600/20 text-indigo-300 border border-indigo-500/20">
                        <TagIcon size={10} />{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">{title}</h1>

                <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <Image src={authorPhoto} height={48} width={48} alt={`${author.firstName} ${author.lastName}`} className="rounded-full border-2 border-purple-500/30" />
                    <div>
                      <div className="text-white font-medium">{`${author.firstName} ${author.lastName}`}</div>
                      <div className="text-gray-400 text-sm">{`@${author.username}`}</div>
                    </div>
                    {followButton && (
                      <button onClick={handleFollowToggle} disabled={loading}
                        className={`ml-4 py-1.5 px-4 text-sm rounded-full transition-colors ${loading ? 'bg-gray-700 text-gray-300' : isFollower ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : isFollower ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400" title="Views"><EyeIcon size={16} /><span>{viewCount}</span></div>
                    <div className="flex items-center gap-1 text-gray-400" title="Comments"><MessageSquare size={16} /><span>{totalCommentCount}</span></div>
                    {readingTime && <div className="flex items-center gap-1 text-gray-400" title="Reading time"><BookOpen size={16} /><span>{readingTime} min read</span></div>}
                    <div className="flex items-center gap-1 text-gray-400" title="Date published"><Calendar size={16} /><span>{formatDate(createdAt)}</span></div>
                  </div>
                </div>

                <article className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-white prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-blockquote:border-purple-500 prose-blockquote:bg-gray-800/50 prose-blockquote:p-2 prose-blockquote:rounded prose-code:text-purple-300 prose-pre:bg-gray-800/70 prose-img:rounded-lg">
                  {parse(content)}
                </article>

                <div className="mt-10 pt-6 border-t border-gray-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleVoteAction('upvote')}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${hasVoted.up ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'} transition-colors`}>
                        <ThumbsUp size={18} /><span>{voteCount.upvotes}</span>
                      </button>
                      <button onClick={() => handleVoteAction('downvote')}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg ${hasVoted.down ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'} transition-colors`}>
                        <ThumbsDown size={18} /><span>{voteCount.downvotes}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={handleBookmark} disabled={bookmarkLoading}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${isBookmarked ? 'bg-indigo-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
                        {isBookmarked ? <Bookmark size={18} /> : <BookmarkPlus size={18} />}<span>{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                      <button onClick={() => setShareDialogOpen(true)} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
                        <Share2 size={18} /><span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden w-full"><Comments blogId={blogId} initialComments={initialComments} /></div>
          </div>
          <div className="hidden lg:block lg:w-4/12"><Comments blogId={blogId} initialComments={initialComments} /></div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewer;