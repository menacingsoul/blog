// components/blog/BlogViewer.tsx
'use client'
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TwitterShareButton, WhatsappShareButton, TelegramShareButton, 
  FacebookShareButton, EmailShareButton,
  TwitterIcon, WhatsappIcon, FacebookIcon, TelegramIcon, EmailIcon
} from 'react-share';
import { handleVote, followUser, unFollowUser, toggleBookmark, recordView } from '@/utils/api';
import { 
  EyeIcon, Share2, X, ThumbsUp, ThumbsDown, Copy,
  Loader2, BookmarkPlus, Bookmark, MessageSquare, Calendar,
  Check, BookOpen, ArrowLeft, Tag as TagIcon, UserPlus, UserCheck,
  Edit, BarChart, Instagram, Send
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
  const [canShareNatively, setCanShareNatively] = useState(false);

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

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanShareNatively(true);
    }
  }, []);

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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing natively:', error);
      }
    }
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const totalCommentCount = initialComments.length;

  return (
    <div className="bg-background relative">
      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShareDialogOpen(false)}>
          <div className="w-full max-w-md p-6 bg-background border border-border rounded-2xl shadow-2xl animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-foreground">Share this article</h3>
              <button onClick={() => setShareDialogOpen(false)} className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <p className="text-muted-foreground text-sm font-medium truncate mb-5">{title}</p>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4 mb-8">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110">
                  <TwitterIcon size={48} round />
                  <span className="text-[11px] text-muted-foreground font-medium">X</span>
                </div>
              </TwitterShareButton>

              <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
                <div className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110">
                  <WhatsappIcon size={48} round />
                  <span className="text-[11px] text-muted-foreground font-medium">WhatsApp</span>
                </div>
              </WhatsappShareButton>

              <FacebookShareButton url={shareUrl}>
                <div className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110">
                  <FacebookIcon size={48} round />
                  <span className="text-[11px] text-muted-foreground font-medium">Facebook</span>
                </div>
              </FacebookShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle} body={`Read this amazing article on BlogVerse: ${shareTitle}`}>
                <div className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110">
                  <EmailIcon size={48} round />
                  <span className="text-[11px] text-muted-foreground font-medium">Email</span>
                </div>
              </EmailShareButton>

              <button 
                onClick={canShareNatively ? handleNativeShare : handleCopyLink}
                className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110"
              >
                <div className="w-[48px] h-[48px] flex items-center justify-center bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-full text-white shadow-lg">
                  <Instagram size={24} />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">Instagram</span>
              </button>

              {canShareNatively && (
                <button 
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-2 group/icon transition-transform hover:scale-110"
                >
                  <div className="w-[48px] h-[48px] flex items-center justify-center bg-zinc-800 rounded-full text-zinc-100 shadow-lg">
                    <Send size={24} />
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">More</span>
                </button>
              )}
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

      {/* Main Content — Medium-style centered narrow column */}
      <div className="max-w-[720px] mx-auto px-5 pt-10 pb-20">

        {/* ======= TITLE ======= */}
        <h1 className="text-[32px] sm:text-[42px] font-extrabold text-foreground tracking-tight leading-[1.15] mb-8">
          {title}
        </h1>

        {/* ======= AUTHOR ROW ======= */}
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/profile/${author.username}`} className="flex-shrink-0">
            <Image 
              src={authorPhoto} 
              height={44} 
              width={44} 
              alt={`${author.firstName} ${author.lastName}`} 
              className="rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${author.username}`} className="text-foreground font-medium text-[15px] hover:underline">
                {`${author.firstName} ${author.lastName}`}
              </Link>
              {!isAuthor && followButton && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <button 
                    onClick={handleFollowToggle} 
                    disabled={loading}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isFollower ? "text-primary hover:text-destructive" : "text-primary hover:text-primary/80"
                    )}
                  >
                    {loading ? "..." : isFollower ? "Following" : "Follow"}
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[13px]">
              {readingTime && <span>{readingTime} min read</span>}
              {readingTime && <span>·</span>}
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* ======= ACTION BAR (top) ======= */}
        <div className="flex items-center justify-between py-3 border-y border-border/60 mb-8">
          {/* Left: Claps + Comments */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => handleVoteAction('upvote')}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                hasVoted.up ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ThumbsUp size={20} className={cn(hasVoted.up && "fill-current")} />
              <span className="text-[13px]">{voteCount.upvotes}</span>
            </button>
            
            <button 
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                const commentsSection = document.getElementById('comments-section');
                commentsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <MessageSquare size={20} />
              <span className="text-[13px]">{totalCommentCount}</span>
            </button>
          </div>

          {/* Right: Bookmark + Share + Edit */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBookmark} 
              disabled={bookmarkLoading}
              className={cn(
                "transition-colors",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title={isBookmarked ? "Remove bookmark" : "Save"}
            >
              {bookmarkLoading ? <Loader2 size={20} className="animate-spin" /> : <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />}
            </button>

            <button 
              onClick={() => setShareDialogOpen(true)} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 size={20} />
            </button>

            {isAuthor && (
              <Link 
                href={`/blog/editor/${blogId}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Edit story"
              >
                <Edit size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* ======= FEATURED IMAGE ======= */}
        {imageUrl && (
          <figure className="mb-10">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <Image src={imageUrl} fill className="object-cover" alt={title} priority />
            </div>
          </figure>
        )}

        {/* ======= ARTICLE BODY ======= */}
        <div className="prose prose-lg dark:prose-invert max-w-none premium-content
          prose-p:text-foreground/90
          prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
          prose-img:rounded-none prose-img:shadow-none prose-img:my-8
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground prose-strong:font-bold
          prose-ol:my-4 prose-ul:my-4
          prose-mark:bg-primary/20 prose-mark:text-primary prose-mark:px-1 prose-mark:rounded
        ">
          {parse(content)}
        </div>

        {/* ======= TAGS ======= */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 mb-6">
            {tags.map(tag => (
              <Link 
                key={tag.id}
                href={`/blog/blogs?search=${encodeURIComponent(tag.name)}`}
                className="px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full text-sm transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* ======= ACTION BAR (bottom) ======= */}
        <div className="flex items-center justify-between py-3 border-y border-border/60 mt-8 mb-8">
          {/* Left: Claps + Comments */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => handleVoteAction('upvote')}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                hasVoted.up ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ThumbsUp size={20} className={cn(hasVoted.up && "fill-current")} />
              <span className="text-[13px]">{voteCount.upvotes}</span>
            </button>
            
            <button 
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                const commentsSection = document.getElementById('comments-section');
                commentsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <MessageSquare size={20} />
              <span className="text-[13px]">{totalCommentCount}</span>
            </button>
          </div>

          {/* Right: Bookmark + Share */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm" title="Views">
              <EyeIcon size={18} />
              <span>{currentViewCount}</span>
            </div>
            <button 
              onClick={handleBookmark} 
              disabled={bookmarkLoading}
              className={cn(
                "transition-colors",
                isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title={isBookmarked ? "Remove bookmark" : "Save"}
            >
              {bookmarkLoading ? <Loader2 size={20} className="animate-spin" /> : <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />}
            </button>
            <button 
              onClick={() => setShareDialogOpen(true)} 
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* ======= AUTHOR BIO / FOLLOW SECTION ======= */}
        <div className="flex items-center gap-4 py-8 mb-12 border-b border-border/40">
          <Link href={`/profile/${author.username}`} className="flex-shrink-0">
            <Image 
              src={authorPhoto} 
              height={72} 
              width={72} 
              alt={`${author.firstName} ${author.lastName}`} 
              className="rounded-full object-cover"
            />
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link href={`/profile/${author.username}`} className="text-foreground font-bold text-lg hover:underline">
                {`${author.firstName} ${author.lastName}`}
              </Link>
              {!isAuthor && followButton && (
                <button 
                  onClick={handleFollowToggle} 
                  disabled={loading}
                  className={cn(
                    "py-2 px-5 text-sm rounded-full transition-all font-medium",
                    loading ? 'bg-muted text-muted-foreground' :
                    isFollower 
                      ? 'bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-border' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : isFollower ? "Following" : "Follow"}
                </button>
              )}
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Link href={`/blog/editor/${blogId}`}
                    className="py-2 px-4 text-sm rounded-full bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center gap-1.5 transition-all font-medium">
                    <Edit size={14} />Edit
                  </Link>
                  <Link href={`/blog/analytics/${blogId}`}
                    className="py-2 px-4 text-sm rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 flex items-center gap-1.5 transition-all font-medium">
                    <BarChart size={14} />Analytics
                  </Link>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">@{author.username}</p>
          </div>
        </div>

        {/* ======= COMMENTS SECTION ======= */}
        <section id="comments-section" className="scroll-mt-24">
          <h3 className="text-xl font-bold text-foreground mb-6">Responses ({totalCommentCount})</h3>
          <Comments blogId={blogId} initialComments={initialComments} currentUserId={currentUserId} blogAuthorId={author.id} />
        </section>
      </div>
    </div>
  );
};

export default BlogViewer;