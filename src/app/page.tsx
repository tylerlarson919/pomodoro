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
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg bg-background p-10 md:shadow-xl">
        <div className="flex flex-col items-center justify-center gap-6 text-white max-w-[600px]">
          <h1 className="z-10 whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter">
            Your Flow, Your Way
          </h1> 
          <p className="text-center">A chill Pomodoro timer that vibes with your aesthetic. Focus effortlessly with calming sounds and dreamy visuals. Pick your style and let time work for you.</p>
          <div className="flex flex-row gap-2">
            <Button variant="solid" color="secondary" onPress={getStarted} size="md">Start For Free!</Button>
            <Button variant="solid" color="secondary" onPress={getStarted} size="md">View Pricing</Button>
          </div>
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
