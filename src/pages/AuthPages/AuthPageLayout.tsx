import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 dark:bg-white/5 lg:grid relative"
        style={{
          backgroundImage: "url('/images/United_Kenya_Club.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Tailwind's slate-900/90 for smooth blend
          backgroundBlendMode: "overlay", // Blends color + image
        }}
        >
          
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/UKC_logo.png"
                  alt="Logo"
                  //className="filter invert brightness-0"
                />
              </Link>
              <p className="text-center text-white dark:text-white/60">
                United Kenya Club
              </p>
            </div>
          </div>
          
        </div>


        
        
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        
        </div>
      </div>
    </div>
  );
}
