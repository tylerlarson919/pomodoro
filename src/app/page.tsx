"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AnimatedGridPattern from "../components/ui/animated-grid-pattern";
import { Button, Image } from "@nextui-org/react";
import { get } from "lodash";
import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import ParticlesStars from "@/components/ui/particles"
import { gifs, backgrounds } from "@/components/SettingsModal/assets"; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import "./page.css";

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
    <div className="flex flex-col w-full min-h-screen items-center justify-start bg-dark1 pb-14">
      <Header/>
      <div className="relative w-full h-full flex flex-col items-center justify-start w-full ">
        <div className="h-full relative flex flex-col w-full items-center justify-center rounded-lg bg-dark1 p-10 md:shadow-xl">
          <div className="z-10 flex flex-col items-center justify-center gap-10 text-white  w-full">
            <div className="flex flex-col items-center justify-center gap-0 text-white">
              <Image
                className="dark h-full w-full"
                src="./podo_logo.png"
                alt="Podo Logo"
                width={100}
                height={100}
              />
              <h1 className=" whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter pb-4">
                Your Flow, Your Way
              </h1> 
              <p className=" text-lg text-center text-white max-w-[600px] leading-tight">A chill Pomodoro timer that vibes with your aesthetic. Focus effortlessly with calming sounds and dreamy visuals. Pick your style and let time work for you.</p>
            </div>
              <div className="flex flex-row gap-2 pt-4">
                <Button variant="solid" color="secondary" onPress={getStarted} size="md">Start For Free!</Button>
                <Button variant="solid" color="secondary" onPress={getStarted} size="md">View Pricing</Button>
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
        <div className="w-full h-full px-10 sm:px-0 sm:w-4/5 sm:max-w-4/5 gap-4">
          <div className="sticky-cards-container w-full">
            <div className="sticky-card block border-2 border-darkaccent3 min-w-full min-h-[500px] max-h-[500px] sm:min-h-[450px] sm:max-h-[450px] flex justify-center items-center">
              <div className="text-left py-0 w-full h-full">
                <div className="container-large">
                  <div className="padding-section-large-6">
                    <div className="card flex flex-col sm:flex-row gap-4 w-full h-full justify-between">
                      <div className="flex flex-col gap-2 items-start justify-center text-left max-w-[550px] px-4 pt-4 sm:px-0 sm:pt-0">
                        <p className="text-white text-3xl">Choose different focus images!</p>
                        <p className="text-textcolor text-lg">Click the arrows to change!</p>
                      </div>                    
                      <div className="z-[10] flex flex-col items-center justify-center">
                        <Image
                          className="dark h-full max-h-[275px] min-h-[100px] w-full "
                          src={gifs[gifKeys[selectedGifIndex]]} // Use the current gif based on index
                          alt={gifKeys[selectedGifIndex]}
                          width={275}
                          isBlurred
                          isLoading={selectedGifIndex === null}
                        />
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[187px]">
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevClick}>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-white"/>
                          </button>
                          <p className="text-white text-center min-w-[130px] w-[130px] min-h-[50px] flex items-center justify-center">{formatGifKey(gifKeys[selectedGifIndex])}</p>
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextClick}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-white"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky-card block border-2 border-darkaccent3 min-w-full min-h-[500px] max-h-[500px] sm:min-h-[450px] sm:max-h-[450px] flex justify-center items-center">
              <div className="text-left py-0 w-full h-full">
                <div className="container-large">
                  <div className="padding-section-large-6">
                    <div className="card flex flex-col sm:flex-row gap-4 w-full h-full justify-between">
                      <div className="flex flex-col gap-2 items-start justify-center text-left max-w-[550px] px-4 pt-4 sm:px-0 sm:pt-0">
                        <p className="text-white text-3xl">Choose background sounds & effects!</p>
                        <p className="text-textcolor text-lg">Choose from more than 20 different background sounds and effects to enhance your focus even more!</p>
                      </div>                    
                      <div className="z-[10] flex flex-col items-center justify-center">
                        
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[187px]">
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevClick}>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-white"/>
                          </button>
                          <p className="text-white text-center min-w-[130px] w-[130px] min-h-[50px] flex items-center justify-center">{formatGifKey(gifKeys[selectedGifIndex])}</p>
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextClick}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-white"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky-card block border-2 border-darkaccent3 min-w-full min-h-[500px] max-h-[500px] sm:min-h-[450px] sm:max-h-[450px] flex justify-center items-center">
              <div className="text-left py-0 w-full h-full">
                <div className="container-large">
                  <div className="padding-section-large-6">
                    <div className="card flex flex-col sm:flex-row gap-4 w-full h-full justify-between">
                      <div className="flex flex-col gap-2 items-start justify-center text-left max-w-[550px] px-4 pt-4 sm:px-0 sm:pt-0">
                        <p className="text-white text-3xl">View key metrics</p>
                        <p className="text-textcolor text-lg">View important stats about your logs in the stats page.</p>
                      </div>                    
                      <div className="z-[10] flex flex-col items-center justify-center">
                        <Image className="w-full" src="/images/stats-page.png" alt="stats-page" height={200} />
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[187px]">
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevClick}>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-white"/>
                          </button>
                          <p className="text-white text-center min-w-[130px] w-[130px] min-h-[50px] flex items-center justify-center">{formatGifKey(gifKeys[selectedGifIndex])}</p>
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextClick}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-white"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 py-10">
            <h1 className="text-white text-center sm:text-left text-4xl md:text-5xl">Get started for free</h1>
            <div className="flex flex-col gap-2 items-center justify-start max-w-[350px]">
              <p className="text-textcolor text-center sm:text-left">Start your journey to focusing today. Join FocusFlow for free and unlock a new world of focus insights.</p>
              <Button color="secondary" variant="shadow" className="w-full">
                Start your free trial
              </Button>
            </div>
          </div>
          <div className="w-full h-full">
            <PricingSection />
          </div>
        </div>
      </div>
    </div>
  );
}
