"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { faBars, faTimes, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@nextui-org/link";



const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });
  
  export default function StatsHeader() {
      const [showMenu, setShowMenu] = useState(false);



    return (
      <div className="absolute top-0 left-0">
        {/* Icon with rotation and transition */}
        <div
          className={`absolute top-2 left-2 z-[100] transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-full-screen-minus-8 sm:translate-x-[400%]" : "translate-x-0"
          }`}
        >
          <FontAwesomeIcon
            icon={showMenu ? faTimes : faBars}
            className={`cursor-pointer text-white w-7 h-7 mt-2 transform transition-transform duration-300 ease-in-out ${
              showMenu ? "rotate-180 scale-110" : "rotate-0 scale-100"
            }`}
            onClick={() => setShowMenu((prev) => !prev)}
          />
        </div>
        
        {/* Menu */}
        <div
          className={`z-40 rounded-2xl rounded-l-none fixed top-0 left-0 h-screen w-screen sm:w-[160px] bg-darkaccent3 bg-opacity-70 backdrop-blur-lg text-white transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-0" : "translate-x-[-100%]"
          }`}
        >
          {/* Menu content */}
          <div className="p-6">
            <h2 className="text-2xl mb-4">Menu</h2>
            <div className="flex flex-col gap-4">
              <Link href="/timer" isBlock color="foreground">Timer</Link>
              <Link href="/stats" isBlock color="secondary">Stats</Link>
            </div>
          </div>
        </div>
    </div>
  );
}
