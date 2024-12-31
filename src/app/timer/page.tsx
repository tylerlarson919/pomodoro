"use client";

import React from "react";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Image, Modal, ModalBody, ModalContent, Button, Input, Skeleton } from "@nextui-org/react";
import { sounds, gifs, endSounds, backgrounds } from "../../components/SettingsModal/assets";
import ParticlesStars from "@/components/ui/particles"
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Add this import
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, addSession, endSession, getSessions, editSettings } from "../../../firebase";
import UHeaderIcon from "@/components/userHeaderIcon";
import StatsHeader from "@/components/StatsHeader";
import Meteors from "@/components/ui/meteors";
import SnowParticles from "@/components/SnowParticles";
import YouTubeAudioPlayer from "@/components/YoutubeAudio";
import TimerPopupModal from "@/components/TimerPopupModal";
import EndSessionButton from "@/components/EndSessionButton";
import { HoverBorderGradient  } from "@/components/ui/hover-border-gradient";
import TimerSelector from "@/components/ui/timer-selector";

const Timer = () => {
  const db = getFirestore();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [taskName, setTaskName] = React.useState("");
  const [timerLength, setTimerLength] = useState(15 * 60 * 1000); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(timerLength);
  const [isElementsVisible, setIsElementsVisible] = useState(true);
  type SoundKeys = keyof typeof sounds; 
  type EndSoundKeys = keyof typeof endSounds; 
  type GifKeys = keyof typeof gifs; 
  const [selectedGif, setSelectedGif] = useState<GifKeys | "">("");
  const [selectedSound, setSelectedSound] = useState<SoundKeys | "">("");
  const [selectedEndSound, setSelectedEndSound] = useState<EndSoundKeys | "">("");
  const [selectedYouTubeAudio, setSelectedYouTubeAudio] = useState<string>('LJih9bxSacU');
  const [isYoutubeAudioPlaying, setIsYoutubeAudioPlaying] = React.useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [isStarsSelected, setIsStarsSelected] = React.useState(false);
  const [isSnowSelected, setIsSnowSelected] = React.useState(false);
  const [isRainSelected, setIsRainSelected] = React.useState(false);
  const [isMeteorsSelected, setIsMeteorsSelected] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = React.useState<"end" | "continue">("end");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();



  const settingsProps = {
    selectedSound,
    selectedEndSound,
    selectedGif,
    selectedBackground,
    isStarsSelected,
  };

  const handlePopupClose = () => {
    if (popupType === "continue") {
      //endTimer with playSound as false
      endTimer(false);
      setPopupType("end");
      setIsPopupOpen(false);
    } else {
      setIsPopupOpen(false);
    }
  };

  const handlePopupConfirm = () => {
    if (popupType === "continue") {
      setIsPopupOpen(false); 
      resumeTimer();
      setPopupType("end");
    } else {
      setIsPopupOpen(false);
      //endTimer with playSound as false
      endTimer(false);
    }
  };

  const resumeTimer = () => {
    console.log("Resuming timer");
    const savedTimer = JSON.parse(localStorage.getItem("currentTimer") || "{}");
    if (savedTimer?.endTime) {
      const now = Date.now();
    setStartTime(savedTimer.startTime);
    setTimeLeft(savedTimer.endTime - now);
    setIsTimerRunning(true);
    startCountdown();
    setIsElementsVisible(false);
    setIsYoutubeAudioPlaying(true);
    }
  };

  useEffect(() => {
    if (!isTimerRunning) {
      setTimeLeft(timerLength);
    }
  }, [timerLength, isTimerRunning]);
  

  useEffect(() => {
    if (user && timerLength) {
      editSettings({ timerLength })
        .catch((err) => console.error("Error updating timer length:", err));
    }
  }, [timerLength, user]);
  
  useEffect(() => {
    const checkCurrentTimer = () => {
      const savedTimer = JSON.parse(localStorage.getItem("currentTimer") || "{}");
      if (savedTimer?.endTime) {
        const now = Date.now();
        if (now >= savedTimer.endTime) {
          // Timer has expired
          console.log("Timer expired");
          localStorage.removeItem("currentTimer");
          setIsTimerRunning(false);
          setStartTime(null);
          setTimeLeft(timerLength);
        } else {
          // Timer is still active
          setPopupType("continue");
          setIsPopupOpen(true);
        }
      }
    };
  
    checkCurrentTimer();
  }, []);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("User is not authenticated, redirecting to login.");
        router.push("/login"); // Redirect to login if not signed in
      } else {
        setUser(user);
        await fetchUserSettings(user.uid); // Fetch user settings if authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  const timerOptions = [
    { label: "30 secs", value: 0.5 * 60 * 1000 },
    { label: "5m", value: 5 * 60 * 1000 },
    { label: "10m", value: 10 * 60 * 1000 },
    { label: "15m", value: 15 * 60 * 1000 },
    { label: "20m", value: 20 * 60 * 1000 },
    { label: "25m", value: 25 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "35m", value: 35 * 60 * 1000 },
    { label: "40m", value: 40 * 60 * 1000 },
    { label: "45m", value: 45 * 60 * 1000 },
    { label: "50m", value: 50 * 60 * 1000 },
    { label: "55m", value: 55 * 60 * 1000 },
    { label: "1hr", value: 60 * 60 * 1000 },
    { label: "1.5hrs", value: 90 * 60 * 1000 },
    { label: "2hr", value: 120 * 60 * 1000 },
    { label: "2.5hrs", value: 150 * 60 * 1000 },
  ];

  const handleTriggerReload = async () => {
    if (user) {
      console.log("Triggering reload...");
      await fetchUserSettings(user.uid); // Fetch updated settings based on user ID
    }
  };

  const fetchUserSettings = async (userId: any) => {
    const userSettingsRef = doc(db, "podo", userId, "settings", "userSettings"); // Adjusted path
    const userSettingsSnap = await getDoc(userSettingsRef);

    if (userSettingsSnap.exists()) {
      const settings = userSettingsSnap.data();

      setTimerLength(settings.timerLength || (15 * 60 * 1000)); // Default to 15 minutes if not found

      setSelectedSound(settings.selectedSound || "");

      // Match selectedSound name to sounds id and set selectedYouTubeAudio
      if (settings.selectedSound) { // Use settings.selectedSound directly
        const matchedSound = Object.entries(sounds).find(
          ([id, sound]) => id === settings.selectedSound
        );
      
        if (matchedSound) {
          setSelectedYouTubeAudio(matchedSound[1]); // Set the video ID, not the key

        }
      }
      

      setSelectedEndSound(settings.selectedEndSound || "");
      
      setSelectedBackground(settings.selectedBackground || "");

      setSelectedGif(settings.selectedGif || "/campfire1.gif");

      setIsStarsSelected(settings.selectedBackground === "Stars");
      setIsSnowSelected(settings.selectedBackground === "Snow");
      setIsRainSelected(settings.selectedBackground === "Rain");
      setIsMeteorsSelected(settings.selectedBackground === "Meteors");

    } else {
      console.log("No user settings found, using defaults."); // Log if no settings are found
      setTimerLength(15 * 60 * 1000); // Default to 15 minutes
    }
  };
  
  

  const startCountdown = () => {
    clearInterval(window.timerInterval); // Clear any existing interval
    window.timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(window.timerInterval);
          endTimer();
          return 0;
        }
        return prev - 1000; // Decrease time left by 1000ms (1 second)
      });
    }, 1000);
  };
  
  

  const startTimer = () => {
    const now = Date.now();
    const sessionId = `session_${now}`;
    const sessionData = {
      timerName: taskName,
      startTime: now,
      timerLength: timerLength / 60000, // Convert milliseconds to minutes
      endTime: now + timerLength,
      currentTimer: true,
      status: "current",
    };

    addSession({ ...sessionData, sessionId }); // Pass session data along with session ID

    localStorage.setItem("currentTimer", JSON.stringify({ ...sessionData, selectedYouTubeAudio }));
    

    setStartTime(now);
    setIsTimerRunning(true);
    setTimeLeft(timerLength);
    setIsElementsVisible(false);
    startCountdown();
    setTaskName("");

    if (selectedYouTubeAudio) {
      setIsYoutubeAudioPlaying(true);
    }
  };

  const endTimer = (playSound = true) => {
    setIsTimerRunning(false);
    setStartTime(null);
    setTimeLeft(timerLength);
    localStorage.removeItem("currentTimer");
    if (playSound) {
      playEndSound();
    };
    setIsElementsVisible(true);

    clearInterval(window.timerInterval); // Clear the interval when the timer ends
    if (selectedYouTubeAudio) {
      setIsYoutubeAudioPlaying(false);
    }

    decideToFinish();
  };

  const decideToFinish = async () => {
    const now = Date.now();
    const user = auth.currentUser;
  
    if (user) {
      const sessions = await getSessions(); // Fetch all sessions
      const currentSessions = sessions?.filter(session => session.status === "current");
  
      if (currentSessions) {
        const mostRecentSession = currentSessions.reduce((prev, current) => 
          (prev.startTime > current.startTime) ? prev : current
        );
      
        const endTime = mostRecentSession.endTime;
        const sessionId = mostRecentSession.id;
      
        // Mark all other current sessions as failed
        await Promise.all(currentSessions.map(async (session) => {
          if (session.id !== sessionId) {
            await endSession(session.id, { completed: false, status: "failed" });
            console.log(`Session with ID: ${session.id} marked as failed.`);
          }
        }));
      
        console.log("Ending session with ID:", sessionId);
        
        if (now > endTime + 5 * 60 * 1000) {
          await endSession(sessionId, { completed: false, status: "failed" });
          console.log("Session marked as failed.");
        } else if (now < endTime) { // Timer ended early
          await endSession(sessionId, { completed: false, status: "failed", wasEndedEarly: true });
          console.log("Session ended early and marked as failed.");
        } else {
          await endSession(sessionId, { completed: true, status: "finished" });
          console.log("Session marked as finished.");
        }        
      }
    }
  };
  

  const handleOptionSelect = (value: number) => {
    setTimerLength(value);
    setTimeLeft(value);
  };


  const playEndSound = () => {
    const defaultEndSound = "/endSounds/task-complete.mp3"; // Replace with your default sound path
    const soundToPlay = selectedEndSound ? endSounds[selectedEndSound as EndSoundKeys] : defaultEndSound;
    const audio = new Audio(soundToPlay);
    audio.loop = true; 
    
    audio.onerror = (e) => {
      console.error("Error loading sound:", e);
  };

    const stopSound = () => {
      audio.pause(); // Stop the audio
      audio.currentTime = 0; // Reset playback to the start
      document.removeEventListener("click", stopSound); // Remove the event listener
    };

    document.addEventListener("click", stopSound); 
    audio.play();
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full h-screen max-h-screen items-center justify-center overflow-hidden bg-dark1">
      <div
        className={`flex w-full text-textcolor fade-gradual ${
          isStarsSelected ? "" : "hidden"
        }`}>
        {isStarsSelected && ( 
          <ParticlesStars
            className=" z-[0] bg-dark1 absolute inset-0"
            quantity={800}
            ease={100}
            color="#ffffff"
            refresh
          />
        )}
      </div>
      <div
        className={`fixed top-0 left-0 w-screen h-screen z-0 fade-gradual ${
          isMeteorsSelected ? "" : "hidden"
        }`}>
        {isMeteorsSelected && (
          <Meteors number={40} />
        )}
      </div>
      <div
        className={`flex w-full text-textcolor fade-gradual ${
          isSnowSelected ? "" : "hidden"
        }`}>
        {isSnowSelected && ( 
          <SnowParticles/>
        )}
      </div>

      <YouTubeAudioPlayer videoId={selectedYouTubeAudio} isPlaying={isYoutubeAudioPlaying} />

      <TimerPopupModal 
        isPopupOpen={isPopupOpen} 
        type={popupType} 
        onClose={() => handlePopupClose()} 
        onConfirm={() => handlePopupConfirm()}
      />
      
      <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
        <StatsHeader />
        <UHeaderIcon onTriggerReload={handleTriggerReload} settingsProps={settingsProps}/>
      </div>
      <div className={`${isElementsVisible ? 'disappearing-element fade-out' : ''}`}>
        <EndSessionButton onPress={() => setIsPopupOpen(true)} />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-6 md:px-0">
        <h1 className={`z-[2] md:px-0 text-center text-textcolor text-4xl ${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
          LOCK IN
        </h1>
        <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
          <Input 
            label="Focusing on..." 
            placeholder="Enter a task" 
            variant="bordered"
            className="dark w-[300px] sm:w-[400px] text-textcolor border-darkaccent3"
            classNames={{inputWrapper: "border-1 border-darkaccent3 hover:border-darkaccent2 focus:border-darkaccent2 bg-darkaccent3/20 "}}
            value={taskName} 
            onValueChange={setTaskName}
          >
          </Input>
        </div>

        <div className="h-full flex flex-col md:flex-row items-center justify-center gap-4">
            <Image
              disableSkeleton
              className="dark"
              src={selectedGif ? gifs[selectedGif as GifKeys] : "/placeholder.png"}
              alt={selectedGif ? selectedGif : ''}
              width={400}
              isBlurred
              isLoading={!selectedGif}
            />
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          <TimerSelector
            canChange={isTimerRunning}
            timerLength={timerLength}
            timerOptions={timerOptions}
            onTimerChange={handleOptionSelect}
            displayValue={formatTime(timeLeft)}
          />

          <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'} w-full h-full flex justify-center `}>
            <HoverBorderGradient 
              containerClassName="rounded-xl " 
              as="button" 
              className="w-28"
              onClick={startTimer}
            >
              Start
            </HoverBorderGradient >
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
