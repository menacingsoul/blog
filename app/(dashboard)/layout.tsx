import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16 h-full overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
