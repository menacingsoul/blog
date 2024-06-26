// components/BlogViewer.tsx
'use client'
import React, { useState } from 'react';
import parse from 'html-react-parser';
import Image from 'next/image';
import { handleVote, addComment } from '@/utils/api';

const BlogViewer = ({ blogId, title, content, upVotes, downVotes, author, initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [voteCount, setVoteCount] = useState({ upvotes: upVotes, downvotes: downVotes });

  const onVote = async (voteType) => {
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

  const onAddComment = async () => {
    try {
      const comment = await addComment(blogId, newComment);
      setComments([...comments, comment.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='md:flex flex-row '>
      <div className="w-full md:w-8/12 shadow-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white/30 hover:border-white/50 hover:shadow-2xl transition-all duration-300 transform p-8 rounded">
        <h1 className="text-3xl mb-4 text-white font-bold">{title}</h1>
        <div className="mb-4 flex items-center">
          <Image
            src={author.profilePhoto}
            height={100}
            width={100}
            alt={`${author.firstName} ${author.lastName}`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-gray-300">{`${author.firstName} ${author.lastName}`}</span>
        </div>
        <div className="prose lg:prose-lg text-gray-200 prose-headings:text-white prose-strong:text-white prose-blockquote:text-white w-full">
          {parse(content)}
        </div>
        <div className="flex mt-4 space-x-4">
          <button onClick={() => onVote('upvote')} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
            Upvote
          </button>
          <button onClick={() => onVote('downvote')} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300">
            Downvote
          </button>
          <span className="text-gray-300">Upvotes: {voteCount.upvotes} | Downvotes: {voteCount.downvotes}</span>
        </div>
      </div>
      <div className="z-50 md:w-4/12 w-full px-4 max-h-screen overflow-y-scroll scrollbar-thumb-rounded">
        <h2 className="text-xl text-white mb-2">Comments</h2>
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
          <button onClick={onAddComment} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogViewer;
