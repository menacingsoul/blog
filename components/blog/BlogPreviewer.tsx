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
    <div className="prose prose-invert max-w-none">
      <article className="text-gray-200">
        {parse(content)}
      </article>
    </div>
  );
};

export default BlogPreviewer;