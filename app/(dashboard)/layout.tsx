import { ReactNode } from "react";
import SidebarToggle from "@/components/SidebarToggle";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="w-screen flex flex-col md:flex-row">
      <SidebarToggle />
      <div className="md:ml-[230px] flex-1 h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
