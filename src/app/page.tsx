"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AnimatedGridPattern from "../components/ui/animated-grid-pattern";
import { Button, Image } from "@nextui-org/react";
import { get } from "lodash";
import Header from "../components/Header";
import ParticlesStars from "@/components/ui/particles"
import { gifs, backgrounds } from "@/components/SettingsModal/assets"; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';


const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });


export default function Home() {
  type GifKeys = keyof typeof gifs; 
  const gifKeys = Object.keys(gifs) as GifKeys[]; // Get all gif keys
  const [selectedGifIndex, setSelectedGifIndex] = useState(0);


  const getStarted = () => {
    window.location.href = "/signup";
  };
  
  const onNextClick = () => {
    setSelectedGifIndex((prevIndex) => (prevIndex + 1) % gifKeys.length);
  };

  const onPrevClick = () => {
    setSelectedGifIndex((prevIndex) => 
      (prevIndex - 1 + gifKeys.length) % gifKeys.length
    );
  };

  const formatGifKey = (key: GifKeys) => {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-start overflow-hidden bg-dark1">
      <Header/>
      <div className="h-full relative flex flex-col w-full items-center justify-center rounded-lg bg-background p-10 md:shadow-xl">
        <div className="z-10 flex flex-col items-center justify-center gap-6 text-white  w-full">
          <h1 className=" whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter">
            Your Flow, Your Way
          </h1> 
          <p className="text-center text-white max-w-[600px]">A chill Pomodoro timer that vibes with your aesthetic. Focus effortlessly with calming sounds and dreamy visuals. Pick your style and let time work for you.</p>
          <Image
              className="dark max-h-[400px] min-h-[400px] w-full"
              src={gifs[gifKeys[selectedGifIndex]]} // Use the current gif based on index
              alt={gifKeys[selectedGifIndex]}
              height={400}
              isBlurred
              isLoading={selectedGifIndex === null}
            />
          
          <div className="z-[10] flex flex-col gap-0 items-center justify-center">
            <div className="flex flex-row gap-2 items-center justify-center">
              <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevClick}>
                <FontAwesomeIcon icon={faChevronLeft} className="text-white"/>
              </button>
              <p className="text-white text-center min-w-[130px] w-[130px] min-h-[50px] flex items-center justify-center">{formatGifKey(gifKeys[selectedGifIndex])}</p>
              <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextClick}>
                <FontAwesomeIcon icon={faChevronRight} className="text-white"/>
              </button>
            </div>
            <p className="text-textcolor text-center">Choose different focus images!</p>
            <div className="flex flex-row gap-2 pt-4">
              <Button variant="solid" color="secondary" onPress={getStarted} size="md">Start For Free!</Button>
              <Button variant="solid" color="secondary" onPress={getStarted} size="md">View Pricing</Button>
            </div>
          </div>
        </div>
        <ParticlesStars
            className=" bg-dark1 absolute inset-0"
            quantity={800}
            ease={100}
            color="#ffffff"
            refresh
          />
      </div>
    </div>
  );
}
