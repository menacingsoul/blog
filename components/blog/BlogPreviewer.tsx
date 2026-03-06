"use client";

import React from "react";
import parse from "html-react-parser";
import Image from "next/image";

interface BlogPreviewerProps {
  title: string;
  content: string;
  imageUrl: string;
}

const BlogPreviewer: React.FC<BlogPreviewerProps> = ({
  title,
  content,
  imageUrl,
}) => {
  return (
    <div className="prose prose-invert max-w-none premium-content prose-mark:bg-primary/20 prose-mark:text-primary prose-mark:px-1 prose-mark:rounded">
      <article className="text-gray-200">
        {parse(content)}
      </article>
    </div>
  );
};

export default BlogPreviewer;