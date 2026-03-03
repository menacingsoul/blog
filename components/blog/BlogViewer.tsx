// components/blog/BlogViewer.tsx
'use client'
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import { TwitterShareButton, WhatsappShareButton, TelegramShareButton, FacebookShareButton, TelegramIcon, XIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { handleVote, followUser, unFollowUser, toggleBookmark, recordView } from '@/utils/api';
import { 
  EyeIcon, Share2, X, ThumbsUp, ThumbsDown, Copy,
  Loader2, BookmarkPlus, Bookmark, MessageSquare, Calendar,
  Check, BookOpen, ArrowLeft, Tag as TagIcon, UserPlus, UserCheck,
  Edit, BarChart
} from 'lucide-react';
import Comments from '../Comments';
import type { BlogAuthor, CommentView, Tag } from '@/types';
import { cn } from '@/lib/utils';

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
  initialBookmarked?: boolean;
  initialVote?: 'up' | 'down' | null;
  isAuthor?: boolean;
  currentUserId?: string;
}

const BlogViewer: React.FC<BlogViewerProps> = ({
  blogId, title, content, upVotes, downVotes, author, initialComments, viewCount, imageUrl, followButton, unfollow, createdAt, readingTime, tags, initialBookmarked = false, initialVote = null, isAuthor = false, currentUserId
}) => {
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isFollower, setIsFollower] = useState(unfollow);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState({ up: initialVote === 'up', down: initialVote === 'down' });
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [currentViewCount, setCurrentViewCount] = useState(viewCount);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/viewer/${blogId}` : '';
  const shareTitle = title;
  const authorPhoto = author.profilePhoto || `https://eu.ui-avatars.com/api/?name=${author.firstName}+${author.lastName || ''}&color=7F9CF5&background=EBF4FF`;

  useEffect(() => { if (copied) { const t = setTimeout(() => setCopied(false), 2000); return () => clearTimeout(t); } }, [copied]);

  useEffect(() => {
    const record = async () => {
      if (currentUserId && blogId) {
        const res = await recordView(blogId);
        if (res && res.message === 'View recorded') {
          setCurrentViewCount(prev => prev + 1);
        }
      }
    };
    record();
  }, [blogId, currentUserId]);

  const handleVoteAction = async (voteType: 'upvote' | 'downvote') => {
    try {
      const updatedBlog = await handleVote(blogId, voteType);
      if (updatedBlog.blog) {
        setVoteCount({ upvotes: updatedBlog.blog.upVotes, downvotes: updatedBlog.blog.downVotes });
      }
      setHasVoted({ up: voteType === 'upvote', down: voteType === 'downvote' });
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
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 relative">
      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShareDialogOpen(false)}>
          <div className="w-full max-w-md p-6 glass-card rounded-2xl shadow-2xl animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-foreground">Share this article</h3>
              <button onClick={() => setShareDialogOpen(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <p className="text-muted-foreground text-sm font-medium truncate mb-5">{title}</p>
            <div className="flex justify-center gap-6 mb-6">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><XIcon size={22} round /></div><span className="text-xs text-muted-foreground">Twitter</span></div>
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><WhatsappIcon size={22} round /></div><span className="text-xs text-muted-foreground">WhatsApp</span></div>
              </WhatsappShareButton>
              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><TelegramIcon size={22} round /></div><span className="text-xs text-muted-foreground">Telegram</span></div>
              </TelegramShareButton>
              <FacebookShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2"><div className="p-3 bg-muted/50 hover:bg-muted rounded-full transition-colors"><FacebookIcon size={22} round /></div><span className="text-xs text-muted-foreground">Facebook</span></div>
              </FacebookShareButton>
            </div>
            <div className="relative">
              <input type="text" value={shareUrl} readOnly className="w-full p-3 bg-muted/50 text-foreground rounded-lg text-sm border border-border focus:outline-none focus:ring-1 focus:ring-primary pr-12" />
              <button onClick={handleCopyLink} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
              {copied && <p className="text-emerald-500 text-xs mt-1 ml-1">Copied to clipboard!</p>}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /><span className="text-sm">Back</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Column */}
          <div className="w-full lg:w-8/12">
            <article className="glass-card rounded-2xl overflow-hidden shadow-xl mb-6">
              {/* Hero Image */}
              {imageUrl && (
                <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                  <Image src={imageUrl} fill className="object-cover" alt={title} priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Floating actions on image */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => setShareDialogOpen(true)} className="p-2.5 glass rounded-full text-white hover:bg-white/20 transition-colors" aria-label="Share"><Share2 size={18} /></button>
                    <button onClick={handleBookmark} disabled={bookmarkLoading}
                      className={cn("p-2.5 rounded-full transition-all", isBookmarked ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'glass text-white hover:bg-white/20')} aria-label="Bookmark">
                      {bookmarkLoading ? <Loader2 size={18} className="animate-spin" /> : isBookmarked ? <Bookmark size={18} /> : <BookmarkPlus size={18} />}
                    </button>
                  </div>
                  {/* Title overlay on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/20 text-white backdrop-blur-sm border border-white/10">
                            <TagIcon size={10} />{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">{title}</h1>
                  </div>
                </div>
              )}

              {/* If no image, show title without overlay */}
              {!imageUrl && (
                <div className="p-6 sm:p-8 pb-0">
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map(tag => (
                        <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                          <TagIcon size={10} />{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">{title}</h1>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Author & Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Image src={authorPhoto} height={48} width={48} alt={`${author.firstName} ${author.lastName}`} className="rounded-full ring-2 ring-primary/20" />
                    <div>
                      <div className="text-foreground font-semibold">{`${author.firstName} ${author.lastName}`}</div>
                      <div className="text-muted-foreground text-sm">@{author.username}</div>
                    </div>
                    {followButton && !isAuthor && (
                      <button onClick={handleFollowToggle} disabled={loading}
                        className={cn(
                          "ml-2 py-1.5 px-4 text-sm rounded-full transition-all flex items-center gap-1.5",
                          loading ? 'bg-muted text-muted-foreground' :
                          isFollower ? 'bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-border' :
                          'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                        )}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : isFollower ? <><UserCheck size={14} />Following</> : <><UserPlus size={14} />Follow</>}
                      </button>
                    )}
                    {isAuthor && (
                      <div className="flex items-center gap-2 ml-2">
                        <Link href={`/myblogs/publishededitor/${blogId}`}
                          className="py-1.5 px-4 text-sm rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center gap-1.5 transition-all">
                          <Edit size={14} />Edit
                        </Link>
                        <Link href={`/myblogs/analytics/${blogId}`}
                          className="py-1.5 px-4 text-sm rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 flex items-center gap-1.5 transition-all">
                          <BarChart size={14} />Analytics
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Stats bar */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5" title="Views"><EyeIcon size={15} /><span>{currentViewCount}</span></div>
                    <div className="flex items-center gap-1.5" title="Comments"><MessageSquare size={15} /><span>{totalCommentCount}</span></div>
                    {readingTime && <div className="flex items-center gap-1.5" title="Reading time"><BookOpen size={15} /><span>{readingTime} min</span></div>}
                    <div className="flex items-center gap-1.5" title="Published"><Calendar size={15} /><span>{formatDate(createdAt)}</span></div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none
                  dark:prose-invert
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-p:text-foreground/80 prose-p:leading-relaxed
                  prose-strong:text-foreground
                  prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline prose-a:border-b prose-a:border-primary/30
                  prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                  prose-code:text-primary prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-li:text-foreground/80
                  prose-hr:border-border
                ">
                  {parse(content)}
                </div>

                {/* Action Bar */}
                <div className="mt-10 pt-6 border-t border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Vote buttons */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleVoteAction('upvote')}
                        className={cn(
                          "flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all",
                          hasVoted.up
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                        )}>
                        <ThumbsUp size={18} className={hasVoted.up ? 'fill-current' : ''} /><span>{voteCount.upvotes}</span>
                      </button>
                      <button onClick={() => handleVoteAction('downvote')}
                        className={cn(
                          "flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all",
                          hasVoted.down
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                        )}>
                        <ThumbsDown size={18} className={hasVoted.down ? 'fill-current' : ''} /><span>{voteCount.downvotes}</span>
                      </button>
                    </div>

                    {/* Save & Share */}
                    <div className="flex items-center gap-2">
                      <button onClick={handleBookmark} disabled={bookmarkLoading}
                        className={cn(
                          "flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-medium transition-all",
                          isBookmarked
                            ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
                            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent'
                        )}>
                        {bookmarkLoading ? <Loader2 size={18} className="animate-spin" /> : isBookmarked ? <Bookmark size={18} className="fill-current" /> : <BookmarkPlus size={18} />}
                        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                      <button onClick={() => setShareDialogOpen(true)} className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all text-sm font-medium border border-transparent">
                        <Share2 size={18} /><span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Comments on mobile */}
            <div className="lg:hidden w-full">
              <div className="glass-card rounded-2xl p-5 shadow-xl">
                <Comments blogId={blogId} initialComments={initialComments} currentUserId={currentUserId} blogAuthorId={author.id} />
              </div>
            </div>
          </div>

          {/* Comments sidebar on desktop */}
          <div className="hidden lg:block lg:w-4/12">
            <div className="sticky top-6 glass-card rounded-2xl p-5 shadow-xl max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin">
              <Comments blogId={blogId} initialComments={initialComments} currentUserId={currentUserId} blogAuthorId={author.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogViewer;