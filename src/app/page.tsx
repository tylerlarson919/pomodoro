"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { Image, Modal, ModalBody, ModalContent, Button } from "@nextui-org/react";
import SettingsModal from "@/components/SettingsModal";
import { sounds, gifs, endSounds } from "../components/SettingsModal/assets";
import Particles from "@/components/ui/particles"




export default function Home() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerLength, setTimerLength] = useState(15 * 60 * 1000); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(timerLength);
  const [showModal, setShowModal] = useState(false);
  const [isElementsVisible, setIsElementsVisible] = useState(true);
  const [triggerReload, setTriggerReload] = useState(false);

  type SoundKeys = keyof typeof sounds; 
  type EndSoundKeys = keyof typeof endSounds; 
  type GifKeys = keyof typeof gifs; 
  const [selectedGif, setSelectedGif] = useState<GifKeys | "">("");
  const [savedSound, setSavedSound] = useState<SoundKeys | null>(null);
  const [savedEndSound, setSavedEndSound] = useState<EndSoundKeys | null>(null);
  const [savedGif, setSavedGif] = useState<GifKeys | null>(null);
  const [selectedSound, setSelectedSound] = useState<SoundKeys | "">("");
  const [selectedEndSound, setSelectedEndSound] = useState<EndSoundKeys | "">("");
  const [selectedYouTubeAudio, setSelectedYouTubeAudio] = useState<string>('LJih9bxSacU');
  const [iframeSrc, setIframeSrc] = useState("https://example.com");
  const [isStarsSelected, setIsStarsSelected] = React.useState(false);



  const timerOptions = [
    { label: "1m", value: 1 * 60 * 1000 },
    { label: "15m", value: 15 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "45m", value: 45 * 60 * 1000 },
    { label: "1hr", value: 60 * 60 * 1000 },
    { label: "2hr", value: 120 * 60 * 1000 },
  ];

  const handleTriggerReload = (value: any) => {
    setTriggerReload(value);
  };


  useEffect(() => {
    const sound = localStorage.getItem("selectedSound");
    const endSound = localStorage.getItem("selectedEndSound");
    const gif = localStorage.getItem("selectedGif");
    const stars = localStorage.getItem("stars");


    if (sound !== null) {
        setSavedSound(sound as SoundKeys); // Type assertion
        setSelectedSound(sound as SoundKeys); // Update selectedSound
        setSelectedYouTubeAudio(sounds[sound as SoundKeys]); // Store only the video ID
        console.log("setSelectedYouTubeAudio:", sounds[sound as SoundKeys]);
    }

    if (gif !== null) {
        setSavedGif(gif as GifKeys); // Type assertion
        setSelectedGif(gif as GifKeys); // Update selectedGif
    }
    if (stars !== null) {
      setIsStarsSelected(true);
    }
    if (endSound !== null) {
      setSavedEndSound(endSound as EndSoundKeys); // Type assertion
      setSelectedEndSound(endSound as EndSoundKeys); // Update selectedGif
    }
  }, [selectedSound, selectedEndSound, selectedGif, isStarsSelected]); // This array will trigger the effect when savedSound or savedGif change



  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedTimerLength = localStorage.getItem("timerLength");

  
    // Check if triggerReload is true
    if (triggerReload) {
      const sound = localStorage.getItem("selectedSound");
      const endSound = localStorage.getItem("selectedEndSound");
      const gif = localStorage.getItem("selectedGif");
  
      if (sound !== null) {
        setSavedSound(sound as SoundKeys); // Type assertion
        setSelectedSound(sound as SoundKeys); // Update selectedSound
        setSelectedYouTubeAudio(sounds[sound as SoundKeys]);
        console.log("Selected Sound:", sounds[sound as SoundKeys]); // Log the sound file path
      }

      if (endSound !== null) {
        setSavedEndSound(endSound as EndSoundKeys); // Type assertion
        setSelectedEndSound(endSound as EndSoundKeys); // Update selectedSound
        console.log("Selected endSound:", endSounds[endSound as EndSoundKeys]); // Log the sound file path
      }
  
      if (gif !== null) {
        setSavedGif(gif as GifKeys); // Type assertion
        setSelectedGif(gif as GifKeys); // Update selectedGif
        console.log("Selected GIF path:", gifs[gif as GifKeys]); // Log the GIF file path
      }
    }
  
    // Existing logic to handle saved timer state
    if (savedStartTime && savedTimerLength) {
      const now = Date.now();
      const elapsed = now - parseInt(savedStartTime, 10);
      const remaining = parseInt(savedTimerLength, 10) - elapsed;
  
      if (remaining > 0) {
        setTimeLeft(remaining);
        setStartTime(parseInt(savedStartTime, 10));
        setTimerLength(parseInt(savedTimerLength, 10));
        setIsTimerRunning(true);
        setIsElementsVisible(false);
        startCountdown(remaining);

        setIframeSrc(`https://www.youtube.com/embed/${selectedYouTubeAudio}?autoplay=1`);
      } else {
        endTimer();
      }
    }
  }, [triggerReload]); // Add triggerReload to the dependency array
  

  const startCountdown = (remainingTime: number) => {
    clearInterval(window.timerInterval);
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(window.timerInterval);
            clearInterval(interval);
            endTimer();
            return 0;
          }
          return prev - 1000;
        });
      });
    }, 1000);
  };
  

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsTimerRunning(true);
    localStorage.setItem("startTime", now.toString());
    localStorage.setItem("timerLength", timerLength.toString());
    setTimeLeft(timerLength);
    setIsElementsVisible(false);
    startCountdown(timerLength);

    if (selectedYouTubeAudio) {
      setIframeSrc(`https://www.youtube.com/embed/${selectedYouTubeAudio}?autoplay=1`);
    }
  };

  const endTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    setTimeLeft(timerLength);
    playEndSound();
    setIsElementsVisible(true);
    localStorage.removeItem("startTime");
    localStorage.removeItem("timerLength");
    clearInterval(window.timerInterval);
    if (selectedYouTubeAudio) {
      setIframeSrc("https://example.com");
    }

  };

  const handleOptionSelect = (value: number) => {
    setTimerLength(value);
    setTimeLeft(value);
    setShowModal(false);
  };


  const playEndSound = () => {
    const defaultEndSound = "./endSounds/daybreak_alarm.mp3"; // Replace with your default sound path
  
    const soundToPlay = selectedEndSound ? endSounds[selectedEndSound as EndSoundKeys] : defaultEndSound;
    const audio = new Audio(soundToPlay);
    audio.play();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-hidden bg-dark1">
      {isStarsSelected ? ( 
        <div className="flex w-full h-20 text-textcolor"> 
          <Particles
            className=" z-[0] bg-dark1 absolute inset-0"
            quantity={800}
            ease={100}
            color="#ffffff"
            refresh
          />
        </div> 
      ) : ( 
        <div className="hidden w-full h-20">
        </div>
      )}
      <iframe 
        width="0" height="0" 
        src={iframeSrc}
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen>
      </iframe>
      
      <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
        <SettingsModal onTriggerReload={handleTriggerReload} />
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className={`z-[2] px-2 md:px-0 text-center text-textcolor text-4xl ${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
          LOCK IN.
        </h1>

        <div className="h-full flex flex-col md:flex-row items-center justify-center gap-4">
          <Image 
            src={selectedGif ? gifs[selectedGif as GifKeys] : "/campfire.gif"}
            alt={selectedGif ? selectedGif : 'Campfire'}
            width={500}
            isBlurred
          />
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          <p 
            className={`z-[1] text-textcolor text-6xl ${isTimerRunning ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => !isTimerRunning && setShowModal(true)}
          >
            {formatTime(timeLeft)}
          </p>

          {showModal && (
            <Modal className="dark" placement="center" isOpen={showModal} onClose={() => setShowModal(false)}>
              <ModalContent>
                <ModalBody className="p-10 bg-darkaccent text-textcolor">
                  {timerOptions.map((option) => (
                    <Button
                      className="bg-darkaccent border-darkaccent2"
                      color="secondary"
                      key={option.value}
                      variant="faded"
                      onPress={() => handleOptionSelect(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ModalBody>
              </ModalContent>
            </Modal>
          )}

          <Button
            variant="ghost"
            color="secondary"
            onPress={startTimer}
            isDisabled={isTimerRunning}
            className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}
          >
            Start
          </Button>
          
        </div>
      </div>
    </div>
  );
}
