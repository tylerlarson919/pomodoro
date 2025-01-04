"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button, Select, SelectItem, Image } from "@nextui-org/react";
import { get } from "lodash";
import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import ParticlesStars from "@/components/ui/particles"
import { gifs, backgrounds } from "@/components/SettingsModal/assets"; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';
import "./page.css";
import Meteors from "@/components/ui/meteors";
import SnowParticles from "@/components/SnowParticles";
import PlayIcon from "../../public/icons/play-icon";
import PauseIcon from "../../public/icons/pause-icon";
import ReactAudioPlayer from 'react-audio-player';
import SlickSlider from "@/components/SlickSlider";

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });

  type Selection = Set<string>;

export default function Home() {
  type GifKeys = keyof typeof gifs; 
  const gifKeys = Object.keys(gifs) as GifKeys[]; // Get all gif keys
  const [selectedGifIndex, setSelectedGifIndex] = useState(0);
  const backgroundValues = Object.values(backgrounds).filter((val) => val !== "");
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState< "stars" | "snow" | "meteors">(backgroundValues[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedBackgroundSound, setSelectedBackgroundSound] = React.useState<Selection>(new Set<string>(["gentleRain"]));
  const [audioToPlay, setAudioToPlay] = React.useState<string | undefined>(undefined);
  
    const handleContextMenu = (e: any) => {
      e.preventDefault(); // Disable the context menu
    };

  useEffect(() => {
    if (isAudioPlaying) {
      if (selectedBackgroundSound.has("gentleRain")) {
        setAudioToPlay("./homepage-sounds/gentle-rain.mp3");
      } else if (selectedBackgroundSound.has("classical")) {
        setAudioToPlay("./homepage-sounds/classical.mp3");
      } else if (selectedBackgroundSound.has("lofi")) {
        setAudioToPlay("./homepage-sounds/lofi.mp3");
      } else if (selectedBackgroundSound.has("healingTones")) {
        setAudioToPlay("./homepage-sounds/healing-tones.mp3");
      }
    } else {
      setAudioToPlay(undefined);
    }
  }, [isAudioPlaying]);

  const playPauseClick = () => {
    setIsAudioPlaying(prevState => !prevState);
  };

  const handleSoundSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsAudioPlaying(false);
    setSelectedBackgroundSound(new Set<string>(e.target.value.split(",")));
  };

  useEffect(() => {
    console.log("Selected GIF:", selectedBackgroundIndex);
  }, [selectedBackgroundIndex]);

  const getStarted = () => {
    window.location.href = "/signup";
  };
  
  const onNextBackground = () => {
    setSelectedBackgroundIndex((prevIndex) => {
      const currentIndex = backgroundValues.indexOf(prevIndex); // Correctly typed
      return backgroundValues[(currentIndex + 1) % backgroundValues.length];
    });
  };
  
  const onPrevBackground = () => {
    setSelectedBackgroundIndex((prevIndex) => {
      const currentIndex = backgroundValues.indexOf(prevIndex); // Correctly typed
      return backgroundValues[(currentIndex - 1 + backgroundValues.length) % backgroundValues.length];
    });
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
    <div className="relative flex flex-col w-full min-h-screen items-center justify-start bg-dark1 pb-14">
      <div className={`w-full h-full relative fade-gradual ${ selectedBackgroundIndex === "stars" ? "" : "hidden"}`}>
        {selectedBackgroundIndex === "stars" && (
            <ParticlesStars
            className="fixed top-0 left-0 w-screen h-screen z-0" // Adjust styling to cover the entire background
            quantity={400} // Check if this number is supported by the component
            ease={100}
            color="#ffffff"
            refresh={true}
          />
        )}
      </div>
      <div className={`fixed top-0 left-0 w-screen h-screen z-0 fade-gradual ${ selectedBackgroundIndex === "snow" ? "" : "hidden"}`}>
        {selectedBackgroundIndex === "snow" && (
          <SnowParticles/>
        )}
      </div>
      <div className={`fixed top-0 left-0 w-screen h-screen z-0 fade-gradual ${ selectedBackgroundIndex === "meteors" ? "" : "hidden"}`}>
        {selectedBackgroundIndex === "meteors" && (
          <Meteors number={40} />
        )}
      </div>
      
      <Header/>
      <div className="relative w-full h-full flex flex-col items-center justify-start w-full ">
        <div className="h-full relative flex flex-col w-full items-center justify-center rounded-lg p-10 md:shadow-xl">
          <div className="z-10 flex flex-col items-center justify-center gap-10 text-white  w-full">
            <div className="flex flex-col items-center justify-center gap-0 text-white">
              <Image
                disableSkeleton
                className="dark h-full"
                src="./logo/focus-flow-logo-white.png"
                alt="Focus Flow logo"
                width={150}
              />
              <h1 className=" whitespace-pre-wrap text-center text-7xl font-medium tracking-tighter pb-4">
                Your Flow, Your Way
              </h1> 
              <p className=" text-lg text-center text-white max-w-[600px] leading-tight">A simple Pomodoro timer that vibes with your aesthetic. Focus effortlessly with calming sounds and dreamy visuals. Pick your style and let time work for you.</p>
            </div>
              <div className="flex flex-row gap-2 pt-4">
                <Button variant="solid" color="secondary" onPress={getStarted} size="md">Start For Free!</Button>
                <Button variant="solid" color="secondary" onPress={getStarted} size="md">View Pricing</Button>
              </div>
          </div>
          
        </div>
          <div className="w-full h-full px-10 sm:px-0 sm:w-4/5 sm:max-w-4/5 max-w-[1000px]">
            <video 
              loop 
              muted
              controls={false}
              autoPlay
              onContextMenu={handleContextMenu}
              className="object-contain w-full h-full rounded-xl"
              src="/prism-timer-vid-tiny.webm"
              
            />
          </div>
          <div className="w-full h-full flex flex-row justify-center items-center gap-2 py-10">
            <h2 className="text-center text-white text-5xl">So many features to </h2>
            <h2 className="text-center text-5xl moving-text-gradient font-semibold">explore</h2>
          </div>
        <div className="w-full h-full px-10 sm:px-0 sm:w-4/5 sm:max-w-4/5 max-w-[1000px] gap-4">
          <div className="sticky-cards-container w-full">
            <div className="sticky-card block border-2 border-darkaccent3 min-w-full min-h-[500px] max-h-[500px] sm:min-h-[450px] sm:max-h-[450px]  flex justify-center items-center">
              <div className="text-left py-0 w-full h-full">
                <div className="container-large">
                  <div className="padding-section-large-6">
                    <div className="card flex flex-col sm:flex-row gap-4 w-full h-full justify-between">
                      <div className="flex flex-col gap-2 items-start justify-center text-left max-w-[550px] px-4 pt-4 sm:px-0 sm:pt-0">
                        <p className="text-white text-3xl">Set the focus image that fits your mood</p>
                        <p className="text-textcolor text-lg">Click the arrows to change</p>
                      </div>                    
                      <div className="z-[10] flex flex-col items-center justify-center">
                        <Image
                          className="dark h-full max-h-[275px] min-h-[100px] w-full "
                          disableSkeleton
                          src={gifs[gifKeys[selectedGifIndex]]} // Use the current gif based on index
                          alt={gifKeys[selectedGifIndex]}
                          width={275}
                          isBlurred
                          isLoading={selectedGifIndex === null}
                        />
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[187px]">
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevClick}>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-secondary animate-pulse"/>
                          </button>
                          <p className="text-white text-center min-w-[130px] w-[130px] min-h-[50px] flex items-center justify-center">{formatGifKey(gifKeys[selectedGifIndex])}</p>
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextClick}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-secondary animate-pulse"/>
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
                        <p className="text-white text-3xl">Choose background sounds & effects</p>
                        <p className="text-textcolor text-lg">Choose from more than 20 different background sounds and effects to enhance your focus even more</p>
                        <div className="flex flex-row gap-2 items-center justify-start min-w-[187px] pt-2 w-full">
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onPrevBackground}>
                            <FontAwesomeIcon icon={faChevronLeft} className="text-secondary animate-pulse"/>
                          </button>
                          <p className="text-white text-center min-w-[60px] w-[60px] min-h-[50px] flex items-center justify-center capitalize">
                            {selectedBackgroundIndex}
                          </p>
                          <button className="bg-transparent hover:bg-white/10 rounded-full p-2" onClick={onNextBackground}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-secondary animate-pulse"/>
                          </button>
                        </div>
                      </div>                    
                      <div className="z-[10] flex items-start justify-center flex-col gap-2">
                        <p className="text-textcolor text-sm text-left">Choose from 20+ focus sounds!</p>
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[230px]">
                            <Select
                              className="dark"
                              classNames={{
                                listbox: "dark",
                                popoverContent: "dark",
                                listboxWrapper: "text-white",
                              }}
                              variant="bordered"
                              aria-label="Background Sound Selection"
                              selectedKeys={selectedBackgroundSound}
                              onChange={handleSoundSelectionChange}
                            >
                              <SelectItem className="dark" key="lofi">LoFi</SelectItem>
                              <SelectItem className="dark" key="gentleRain">Gentle Rain</SelectItem>
                              <SelectItem className="dark" key="classical">Classical</SelectItem>
                              <SelectItem className="dark" key="healingTones">Healing Tones</SelectItem>
                              <SelectItem isReadOnly className="dark text-textcolor data-[hover=true]:text-textcolor data-[hover=true]:bg-transparent" key="manyMore">And many more!</SelectItem>
                            </Select>
                            <button className="animate-pulsesm bg-white/15 hover:bg-white/10 backdrop-blur-lg rounded-lg p-2 transition-all" onClick={playPauseClick}>
                              {isAudioPlaying ? (
                                <PauseIcon color="#7828c8" width={20} height={20}/>
                              ) : (
                                <PlayIcon color="#7828c8" width={20} height={20}/>
                              )}
                            </button>
                            {isAudioPlaying ? (
                            <ReactAudioPlayer
                              onEnded={() => (setIsAudioPlaying(false))}
                              src={audioToPlay}
                              autoPlay
                            />
                            ) : null}
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
                      <div className="w-full sm:w-1/2 flex flex-col gap-2 items-start justify-center text-left max-w-[550px] px-4 pt-4 sm:px-0 sm:pt-0">
                        <p className="text-white text-3xl">Track your focus journey</p>
                        <p className="text-textcolor text-lg">View important stats to see your strengths and weaknesses</p>
                      </div>
                      <div className="w-full sm:w-1/2 z-[10] flex items-center justify-center">
                        <div className="flex flex-row gap-2 items-center justify-center min-w-[187px]">
                          <SlickSlider/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className=" flex flex-col sm:flex-row justify-between items-center w-full gap-4 py-16">
            <h1 className="z-10 text-white text-center sm:text-left text-4xl md:text-5xl">Get started for free</h1>
            <div className="flex flex-col gap-2 items-center justify-start max-w-[350px]">
              <p className="text-textcolor text-center sm:text-left z-10">Start your journey to focusing today. Join FocusFlow for free and unlock a new world of focus insights.</p>
              <Button color="secondary" variant="shadow" className="z-10 w-full">
                Start your free trial
              </Button>
            </div>
          </div>
          <div className="w-full h-full ">
            <PricingSection />
          </div>
        </div>
      </div>
     
    </div>
  );
}
