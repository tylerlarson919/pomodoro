"use client";

import { useEffect, useState, useRef } from "react";
import { Image, Modal, ModalBody, ModalContent, Button } from "@nextui-org/react";
import SettingsModal from "@/components/SettingsModal";
import { sounds, gifs } from "../components/SettingsModal/assets";
import YouTube from 'react-youtube';


type YouTubePlayer = {
  loadVideoById: (videoId: string) => void;
  playVideo: () => void;
  stopVideo: () => void;
  setVolume: (volume: number) => void;
};

const youtubeOptions = {
  height: '0',
  width: '0',
  playerVars: {
    autoplay: 0,
    controls: 0,
    mute: 1  // Mute the video by default
  }
};

export default function Home() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerLength, setTimerLength] = useState(15 * 60 * 1000); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(timerLength);
  const [showModal, setShowModal] = useState(false);
  const [isElementsVisible, setIsElementsVisible] = useState(true);
  const [triggerReload, setTriggerReload] = useState(false);

  type SoundKeys = keyof typeof sounds; 
  type GifKeys = keyof typeof gifs; 
  const [selectedGif, setSelectedGif] = useState<GifKeys | "">("");
  const [savedSound, setSavedSound] = useState<SoundKeys | null>(null);
  const [savedGif, setSavedGif] = useState<GifKeys | null>(null);
  const [selectedSound, setSelectedSound] = useState<SoundKeys | "">("");
  const player = useRef<YouTubePlayer | null>(null); // Specify type
  const [selectedYouTubeAudio, setSelectedYouTubeAudio] = useState<string>('');




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
    const gif = localStorage.getItem("selectedGif");

    if (sound !== null) {
        setSavedSound(sound as SoundKeys); // Type assertion
        setSelectedSound(sound as SoundKeys); // Update selectedSound
    }

    if (gif !== null) {
        setSavedGif(gif as GifKeys); // Type assertion
        setSelectedGif(gif as GifKeys); // Update selectedGif
    }
  }, [selectedSound, selectedGif]); // This array will trigger the effect when savedSound or savedGif change



  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedTimerLength = localStorage.getItem("timerLength");
  
    // Check if triggerReload is true
    if (triggerReload) {
      const sound = localStorage.getItem("selectedSound");
      const gif = localStorage.getItem("selectedGif");
  
      if (sound !== null) {
        setSavedSound(sound as SoundKeys); // Type assertion
        setSelectedSound(sound as SoundKeys); // Update selectedSound
        console.log("Selected Sound:", sounds[sound as SoundKeys]); // Log the sound file path
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
      } else {
        endTimer();
      }
    }
  }, [triggerReload]); // Add triggerReload to the dependency array
  

  const startCountdown = (remainingTime: number) => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          endTimer();
          return 0;
        }
        return prev - 1000;
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
    startCountdown(timerLength);

    if (player.current && selectedYouTubeAudio) {
      try {
        player.current.loadVideoById(selectedYouTubeAudio);
        player.current.playVideo();
        player.current.setVolume(0);
      } catch (error) {
        console.error('Error starting YouTube audio:', error);
      }
    }

  };

  const endTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    setTimeLeft(timerLength);
    setIsElementsVisible(true);
    localStorage.removeItem("startTime");
    localStorage.removeItem("timerLength");
    if (player.current && selectedYouTubeAudio) {
      player.current.stopVideo();
    }
  };

  const handleOptionSelect = (value: number) => {
    setTimerLength(value);
    setTimeLeft(value);
    setShowModal(false);

  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-hidden">
      <YouTube 
        videoId={selectedYouTubeAudio} 
        opts={youtubeOptions}
        onReady={(event) => { 
          player.current = event.target; 
          event.target.setVolume(0);  // Ensure volume is set to 0
        }}
        onError={(error) => {
          console.error('YouTube Player Error:', error);
        }}
      />
      <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
        <SettingsModal onTriggerReload={handleTriggerReload} />
      </div>
      <div className="flex flex-col items-center justify-center  bg-dark1 gap-6">
        <h1 className={`px-2 md:px-0 text-center text-textcolor text-4xl ${isElementsVisible ? '' : 'disappearing-element fade-out'}`}
        >
          Get Ready to Focus...
        </h1>

        <div className="h-full flex flex-col md:flex-row items-center justify-center gap-4">
          <Image 
            src={selectedGif ? gifs[selectedGif as GifKeys] : "/campfire.gif"}
            alt={selectedGif ? selectedGif : 'Campfire'}
            width={500}
            isBlurred
          />
        </div>

        <div className="flex flex-col gap-2 items-center justify-center">
          <p 
            className={`text-6xl ${isTimerRunning ? 'cursor-default' : 'cursor-pointer'}`}
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
