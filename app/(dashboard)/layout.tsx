import { ReactNode } from "react";
import SidebarToggle from "@/components/SidebarToggle";
interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  

  return (
       <div className="h-screen w-screen flex flex-col md:flex-row">
      <SidebarToggle />
      <div className="md:ml-[300px] h-full flex-1">
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
