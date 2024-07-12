import { ReactNode } from "react";
import SidebarToggle from "@/components/SidebarToggle";
interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  

  return (
    <html>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5673721717655381"
     crossOrigin="anonymous"></script>
      <div className="h-screen w-screen flex flex-col md:flex-row">
      <SidebarToggle />
      <div className="md:ml-[300px] h-full flex-1">
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
    </html>
    
  );
};

export default DashboardLayout;
