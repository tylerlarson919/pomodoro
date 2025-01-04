"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../../firebase";
import { usePathname } from "next/navigation";
import ClockIcon from "../../../public/icons/clock";
import BarChartIcon from "../../../public/icons/bar-chart";
import XIcon from "../../../public/icons/x-icon";
import MenuIcon from "../../../public/icons/menu-icon";

  export default function StatsHeader() {
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState<null | User>(null);
    const [currentPage, setCurrentPage] = useState<string>('');
    const pathname = usePathname(); 


    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          const dropdownMenu = document.getElementById("header-menu");
          const userProfile = document.getElementById("header-button");
  
          if (
              dropdownMenu &&
              userProfile &&
              !dropdownMenu.contains(event.target as Node) &&
              !userProfile.contains(event.target as Node)
          ) {
              setShowMenu(false);
              console.log("clicked outside");
          }
      };
  
      if (showMenu) {
          window.addEventListener('click', handleClickOutside);
      } else {
          window.removeEventListener('click', handleClickOutside);
      }
  
      return () => {
          window.removeEventListener('click', handleClickOutside); // Cleanup listener on unmount
      };
  }, [showMenu]);
  
  
  


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });

      // Log the current page name
      const currentPage = pathname.split("/").pop() || ""; // Use pathname
      setCurrentPage(currentPage);

      return () => unsubscribe(); // Cleanup listener on unmount
    }, [pathname])

    return (
        <div className="absolute top-0 left-0">
        {/* Icon with rotation and transition */}
        <div 
          className={`absolute top-6 left-4 z-[100] transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-full-screen-minus-8 sm:translate-x-[360%]" : "translate-x-0"
          }`}
        >
          {showMenu ? (
            <div id="header-button"
              className={`cursor-pointer w-7 h-6 transform transition-transform duration-300 ease-in-out ${
                showMenu ? "rotate-180 scale-110" : "rotate-0 scale-100"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
            >
              <XIcon color="white" width={"24"} height={"24"}/>
            </div>
          ) : (
            <div 
              className={`cursor-pointer w-7 h-7 transform transition-transform duration-300 ease-in-out ${
                showMenu ? "rotate-180 scale-110" : "rotate-0 scale-100"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
            >
              <MenuIcon color="white" className="w-7 h-7"/>
            </div>
          )}
        </div>
        
        {/* Menu */}
        <div id="header-menu"
          className={`z-40 rounded-2xl rounded-l-none fixed top-0 left-0 h-screen w-screen sm:w-[160px] bg-darkaccent3 bg-opacity-70 backdrop-blur-lg text-white transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-0" : "translate-x-[-100%]"
          }`}
        >
          {/* Menu content */}
          <div className="p-4">
            <div className="flex flex-col gap-1 pt-4">
              <Image 
                alt="Focus Flow Logo"
                src="./logo/focus-flow-icon-white.png"
                height={63}
                width={63}
              />
              <div className={`flex flex-row gap-1.5 items-center justify-start text-textcolor rounded-md p-2 ${currentPage === "timer" ? "hover:bg-secondary/20" : "hover:bg-textcolor/20"}`}>
                <ClockIcon color={currentPage === "timer" ? "#6020A0" : "#939393"} className="w-2 h-2"/>
                <Link href="/timer" className={`${currentPage === "timer" ? "text-secondary" : "text-textcolor"} font-semibold`}>Timer</Link>
              </div>
              <div className={`flex flex-row gap-1.5 items-center justify-start text-textcolor rounded-md p-2 ${currentPage === "stats" ? "hover:bg-secondary/20" : "hover:bg-textcolor/20"}`}>
                <BarChartIcon color={currentPage === "stats" ? "#6020A0" : "#939393"} className="w-2 h-2"/>
                <Link href="/stats" className={`${currentPage === "stats" ? "text-secondary" : "text-textcolor"} font-semibold`}>Stats</Link>
              </div>
            </div>
          </div>
        </div>      
    </div>
  );
}
