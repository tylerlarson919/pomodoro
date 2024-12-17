"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { Image, Modal, ModalBody, ModalContent, Button, Input } from "@nextui-org/react";
import SettingsModal from "@/components/SettingsModal";
import { sounds, gifs, endSounds } from "../../components/SettingsModal/assets";
import Particles from "@/components/ui/particles"
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Add this import

import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, addSession, endSession, getSessions } from "../../../firebase";



const Timer = () => {
  const db = getFirestore();

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [taskName, setTaskName] = React.useState("");
  const [timerLength, setTimerLength] = useState(15 * 60 * 1000); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(timerLength);
  const [showModal, setShowModal] = useState(false);
  const [isElementsVisible, setIsElementsVisible] = useState(true);
  type SoundKeys = keyof typeof sounds; 
  type EndSoundKeys = keyof typeof endSounds; 
  type GifKeys = keyof typeof gifs; 
  const [selectedGif, setSelectedGif] = useState<GifKeys | "">("");
  const [selectedSound, setSelectedSound] = useState<SoundKeys | "">("");
  const [selectedEndSound, setSelectedEndSound] = useState<EndSoundKeys | "">("");
  const [selectedYouTubeAudio, setSelectedYouTubeAudio] = useState<string>('LJih9bxSacU');
  const [iframeSrc, setIframeSrc] = useState("https://example.com");
  const [isStarsSelected, setIsStarsSelected] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();


  const settingsProps = {
    selectedSound,
    selectedEndSound,
    selectedGif,
    isStarsSelected,
  };


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
    { label: "1m", value: 1 * 60 * 1000 },
    { label: "15m", value: 15 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "45m", value: 45 * 60 * 1000 },
    { label: "1hr", value: 60 * 60 * 1000 },
    { label: "2hr", value: 120 * 60 * 1000 },
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

      setSelectedEndSound(settings.selectedEndSound || "");

      setSelectedGif(settings.selectedGif || "");

      setIsStarsSelected(settings.stars === true);
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

    setStartTime(now);
    setIsTimerRunning(true);
    setTimeLeft(timerLength);
    setIsElementsVisible(false);
    startCountdown();
    setTaskName("");

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

    clearInterval(window.timerInterval); // Clear the interval when the timer ends
    if (selectedYouTubeAudio) {
      setIframeSrc("https://example.com");
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
    setShowModal(false);
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
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-hidden bg-dark1">
      <div
        className={`flex w-full text-textcolor fade-gradual ${
          isStarsSelected ? "" : "hidden"
        }`}
      >
        {isStarsSelected && ( 
          <Particles
            className=" z-[0] bg-dark1 absolute inset-0"
            quantity={800}
            ease={100}
            color="#ffffff"
            refresh
          />
        )}
      </div>
      <iframe 
        width="0" height="0" 
        src={iframeSrc}
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowFullScreen>
      </iframe>
      
      <div className={`${isElementsVisible ? '' : 'disappearing-element fade-out'}`}>
        <SettingsModal onTriggerReload={handleTriggerReload} settingsProps={settingsProps} />
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
            src={selectedGif ? gifs[selectedGif as GifKeys] : "/campfire.gif"}
            alt={selectedGif ? selectedGif : 'Campfire'}
            width={400}
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
                <ModalBody className="p-10 bg-darkaccent text-textcolor grid grid-cols-3 gap-4 justify-items-center align-items-center">
                  {timerOptions.map((option) => (
                    <Button
                      className="bg-darkaccent border-darkaccent2 border-1 w-[80px] sm:w-[120px]"
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
};

export default Timer;
