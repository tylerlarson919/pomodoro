"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { faBars, faChartSimple, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";



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
          <div className="p-4">
            <div className="flex flex-col gap-4 pt-4">
              <Image 
                alt="Podo Logo"
                src="./podo_logo.png"
                height={63}
                width={63}
              />
              <div className="flex flex-row gap-1 items-center justify-start">
                <FontAwesomeIcon icon={faChartSimple} className="w-4 h-4" />
                <Link href="/timer" isBlock color="foreground">
                  Timer
                </Link>
              </div>
              <div className="flex flex-row gap-1 items-center justify-start">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-secondary" />
                <Link href="/stats" isBlock color="secondary">Stats</Link>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
