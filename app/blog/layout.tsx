import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface Props {
  children: ReactNode;
}

const BlogLayout = ({ children }: Props) => {
  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
};

export default BlogLayout;
