import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import bgImg from "../../public/images/bgImages/woodlight.jpg"

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex" >
      <div style={{color:"#fff"}}>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6" 
            style={{
              backgroundImage: `url(${bgImg})`,
              backgroundColor: "rgba(118, 116, 116, 0.5)",
              backgroundSize: '300px',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              backgroundBlendMode: 'overlay', // or 'overlay', 'screen',multiply etc.
              height: '100vh', // optional: makes it full screen height
              //color: 'white'   // optional: contrast text
            }}
          >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
