"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "../components/ui/animated-grid-pattern";
import { Button } from "@nextui-org/react";
import { get } from "lodash";
import Header from "../components/Header";


export default function Home() {

  const getStarted = () => {
    window.location.href = "/signup";
  };
  

  return (
    <div className="flex flex-col w-full h-screen items-center justify-start overflow-hidden bg-dark1">
      <Header/>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg bg-background p-20 md:shadow-xl">
        <div className="flex flex-col items-center justify-center gap-6 text-white">
          <h1 className="z-10 whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter">
            Get Started For Free!
          </h1> 
          <p>Supercharge your focus with Podo - Experience the ultimate web-based focus tool!</p>
          <Button variant="ghost" color="primary" onPress={getStarted} size="md">Get Started For Free!</Button>
        </div>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
          )}
        />
      </div>
    </div>
  );
}
