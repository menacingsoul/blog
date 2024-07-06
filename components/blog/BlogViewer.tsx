// components/BlogViewer.tsx
'use client'
import React, { useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { TwitterShareButton, WhatsappShareButton, TelegramShareButton, FacebookShareButton, TelegramIcon, XIcon, WhatsappIcon, FacebookIcon } from 'react-share';
import { handleVote, addComment } from '@/utils/api';
import { EyeIcon, Share, X } from 'lucide-react';
import { ArrowBigDownIcon, ArrowBigUpIcon,Clipboard } from 'lucide-react';
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
}

interface BlogViewerProps {
  blogId: string;
  title: string;
  content: string;
  upVotes: number;
  downVotes: number;
  author: Author;
  imageUrl:string;
  initialComments: Comment[];
  viewCount: number;  // Add viewCount prop
}

const BlogViewer: React.FC<BlogViewerProps> = ({ 
  blogId, title, content, upVotes, downVotes, author, initialComments, viewCount ,imageUrl
}) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });
  const [shareDialogBox,setShareDialogBox] = useState(false);

  const onVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      const updatedBlog = await handleVote(blogId, voteType);
      setVoteCount({
        upvotes: updatedBlog.blog.upVotes,
        downvotes: updatedBlog.blog.downVotes,
      });
    } catch (error) {
      console.error('Error handling vote:', error);
    }
  };

  const onShareClick=()=>{
    setShareDialogBox(true);
  }

  const onAddComment = async () => {
    try {
      const comment = await addComment(blogId, newComment);
      setComments([...comments, comment.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const shareUrl = `https://blogfiles.vercel.app/blog/viewer/${blogId}`;
  const shareTitle = title;

  return (
    <>
    {shareDialogBox && (
  <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#E2DFD0]/20 to-[#E2DFD0]/30 backdrop-filter backdrop-blur-lg border border-[#E2DFD0]/30 shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between mb-4 text-xl font-semibold text-amber-100">
        <div>Share</div>
        <div className="cursor-pointer" onClick={() => { setShareDialogBox(false) }}>
          <X />
        </div>
      </div>
      <h2 className="md:text-xl text-lg gap-x-1 font-semibold mb-4 text-gray-300">
        {title}
      </h2>
      <div className="flex justify-center mt-4 space-x-4">
        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <XIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl} title={shareTitle}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <TelegramShareButton url={shareUrl} title={shareTitle}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <FacebookShareButton url={shareUrl} title={shareTitle}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="w-full p-2 text-gray-800 bg-gray-200 rounded"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert('URL copied to clipboard!');
          }}
          className="text-white"
        >
          <Clipboard size={24} className="text-gray-300 hover:text-white" />
        </button>
      </div>
    </div>
  </div>
)}
    <div className='md:flex flex-row '>
      <div className="w-full md:w-8/12 shadow-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white/30 hover:border-white/50 hover:shadow-2xl transition-all duration-300 transform p-8 rounded max-h-screen overflow-y-scroll scrollbar-thumb-rounded">
        <div className='flex justify-between items-center mb-4'>
          <h1 className="md:text-3xl text-2xl text-white font-bold">{title}</h1>
          <div className='text-white cursor-pointer' onClick={onShareClick}><Share/></div>
        </div>
        
        <div className="mb-4 flex items-center">
          <Image
            src={author.profilePhoto}
            height={100}
            width={100}
            loading='lazy'
            alt={`${author.firstName} ${author.lastName}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className='flex flex-col'>
            <span className="text-gray-100">{`${author.firstName} ${author.lastName}`}</span>
            <span className="text-gray-300 text-xs">{`@${author.username}`}</span>
          </div>
        </div>
        <Image
        src={imageUrl}
        unoptimized={true}
        height={100}
        width={100}
        alt='blog_image'
        className='w-full bg-white p-3 rounded mb-3'
        />
       <div className="prose text-gray-200 prose-headings:text-white prose-strong:text-white prose-blockquote:text-white w-full">
  {parse(content)}
</div>

        <div className="flex flex-col sm:flex-row mt-2 space-x-4 items-center">
          <div className='flex items-center mt-4 space-x-2'>
            <button onClick={() => onVote('upvote')} className="flex px-4 gap-x-2 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300">
              <ArrowBigUpIcon/>{voteCount.upvotes}
            </button>
            <button onClick={() => onVote('downvote')} className="flex px-4 gap-x-2  py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300">
              <ArrowBigDownIcon/>{voteCount.downvotes}
            </button>
          </div>
          <div className="text-gray-300 items-center"><div className='flex gap-x-1 items-center'><EyeIcon/> {viewCount}</div></div>  {/* Display view count */}
        </div>
      </div>
      <div className="z-50 md:w-4/12 w-full px-4 max-h-screen overflow-y-scroll scrollbar-thumb-rounded">
        <h2 className="text-xl text-white mb-2 p-2">Comments</h2>
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-gray-800 bg-opacity-40 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {comment.author && (
                  <Image
                    src={comment.author.profilePhoto}
                    height={20}
                    width={20}
                    alt={`${comment.author.firstName} ${comment.author.lastName}`}
                    className="rounded-full mr-3"
                  />
                )}
                <span className="text-gray-300 text-sm">{comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'You'}</span>
              </div>
              <p className="text-gray-200 text-sm">{comment.content}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 bg-gray-800 text-gray-200 rounded-lg"
          />
          <button onClick={onAddComment} className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors duration-300">
            Submit
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogViewer;
