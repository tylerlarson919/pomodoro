import React from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

interface TimerOption {
  value: number;
  label: string;
}

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });

interface TimerSelectorProps {
  timerLength: number;
  timerOptions: TimerOption[];
  displayValue: any;
  canChange: boolean;
  onTimerChange: (value: number) => void;
}

const TimerSelector: React.FC<TimerSelectorProps> = ({ timerLength, timerOptions, onTimerChange, displayValue, canChange }) => {
  const getCurrentIndex = () => {
    return timerOptions.findIndex((option: TimerOption) => option.value === timerLength) || 0;
  };

  const handleNext = () => {
    const currentIndex = getCurrentIndex();
    const nextIndex = (currentIndex + 1) % timerOptions.length;
    onTimerChange(timerOptions[nextIndex].value);
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentIndex();
    const previousIndex = (currentIndex - 1 + timerOptions.length) % timerOptions.length;
    onTimerChange(timerOptions[previousIndex].value);
  };

  const currentOption = timerOptions[getCurrentIndex()];

  return (
    <div className="flex items-center justify-center gap-2">
      <button 
        onClick={handlePrevious}
        className={`${!canChange ? '' : 'disappearing-element fade-out'} p-2 rounded-full flex items-center`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 text-textcolor animate-pulse"/>
      </button>
      
      <p className={`z-[1] text-textcolor text-6xl`}>
        {displayValue}
      </p>

      <button 
        onClick={handleNext}
        className={`${!canChange ? '' : 'disappearing-element fade-out'} p-2 rounded-full flex items-center`}
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-textcolor animate-pulse"/>
      </button>
    </div>
  );
};

export default TimerSelector;