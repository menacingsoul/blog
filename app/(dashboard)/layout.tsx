import { ReactNode } from "react";
import SidebarToggle from "@/components/SidebarToggle";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <SidebarToggle />
      <div className="md:ml-[230px] flex-1 h-full overflow-auto pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
