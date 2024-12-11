"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Modal, ModalBody, ModalContent, Button, Dropdown } from "@nextui-org/react";

export default function Home() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timerLength, setTimerLength] = useState(15 * 60 * 1000); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(timerLength);
  const [showModal, setShowModal] = useState(false);
  const [isElementsVisible, setIsElementsVisible] = useState(true);

  const timerOptions = [
    { label: "15m", value: 15 * 60 * 1000 },
    { label: "30m", value: 30 * 60 * 1000 },
    { label: "45m", value: 45 * 60 * 1000 },
    { label: "1hr", value: 60 * 60 * 1000 },
    { label: "2hr", value: 120 * 60 * 1000 },
  ];

  useEffect(() => {
    const savedStartTime = localStorage.getItem("startTime");
    const savedTimerLength = localStorage.getItem("timerLength");

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
  }, []);

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
  };

  const endTimer = () => {
    setIsTimerRunning(false);
    setStartTime(null);
    setTimeLeft(timerLength);
    setIsElementsVisible(true);
    localStorage.removeItem("startTime");
    localStorage.removeItem("timerLength");
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
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-dark1 gap-6">
      <h1 className={`text-textcolor text-4xl ${isElementsVisible ? '' : 'disappearing-element fade-out'}`}
      >
        Get Ready to Focus...
      </h1>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
        <Image src="/campfire.gif" alt="campfire" width={500} height={500} unoptimized />
      </div>

      <div className="flex flex-col gap-2 items-center justify-center">
        <p 
          className={`text-6xl ${isTimerRunning ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => !isTimerRunning && setShowModal(true)}
        >
          {formatTime(timeLeft)}
        </p>

        {showModal && (
          <Modal placement="center" isOpen={showModal} onClose={() => setShowModal(false)}>
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
  );
}
