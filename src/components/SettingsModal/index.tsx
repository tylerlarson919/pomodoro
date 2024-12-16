"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { faBars, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Modal, ModalBody, ModalContent, Select, SelectSection, SelectItem, Button } from "@nextui-org/react";
import { sounds, gifs, endSounds } from "./assets"; 
import { editSettings, auth, db } from '../../../firebase'; 


interface SettingsModalProps {
  onTriggerReload: () => void; // Function to handle reload trigger
  settingsProps: {
    selectedSound: string;
    selectedEndSound: string;
    selectedGif: string;
    isStarsSelected: boolean;
  };
}


const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });
  
  export default function SettingsModal({ onTriggerReload, settingsProps }: SettingsModalProps) {
  
    const [showModal, setShowModal] = useState(false);
    const [selectedSound, setSelectedSound] = useState(settingsProps.selectedSound);
    const [selectedEndSound, setSelectedEndSound] = useState(settingsProps.selectedEndSound);
    const [selectedGif, setSelectedGif] = useState(settingsProps.selectedGif);
    const [isStarsSelected, setIsStarsSelected] = useState(settingsProps.isStarsSelected); 
    type EndSoundKeys = keyof typeof endSounds; 


    
    const playEndSound = (soundName: string) => {
      const defaultEndSound = "./endSounds/daybreak_alarm.mp3"; // Default sound path
      const soundToPlay = soundName ? endSounds[soundName as EndSoundKeys] : defaultEndSound;
      const audio = new Audio(soundToPlay);
      audio.play();
    };
    
    // sync settings with props
    useEffect(() => {
      setSelectedSound(settingsProps.selectedSound);
      setSelectedEndSound(settingsProps.selectedEndSound);
      setSelectedGif(settingsProps.selectedGif);
      setIsStarsSelected(settingsProps.isStarsSelected);
    }, [settingsProps]);


    const save = async () => {
      const settings = {
        selectedSound,
        selectedEndSound,
        selectedGif,
        stars: isStarsSelected,
      };
    
      await editSettings(settings); // Save settings to Firestore
    
      // Trigger reload immediately after saving settings
      onTriggerReload(); 
    
      setShowModal(false); // Close modal after saving
    };
    


  return (
    <div className="absolute top-4 left-4">
        <FontAwesomeIcon 
          icon={faBars}  
          className="cursor-pointer text-white w-7 h-7 mt-2" 
          onClick={() => setShowModal(true)}
        /> 
        {showModal && (
            <Modal 
              className="dark bg-darkaccent"
              placement="center"
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            >
              <ModalContent>
                <ModalBody className="p-10  text-textcolor">

                <h3>Select Background Sound</h3>
                <Select
                  className=""
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "text-white p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select Background Sound"
                  placeholder="Select Background Sound"
                  defaultSelectedKeys={[selectedSound]}
                  onChange={(event) => setSelectedSound(event.target.value)} 
                  value={selectedSound}
                >
                  {Object.keys(sounds).map(sound => (
                    <SelectItem textValue={sound.replace(/([A-Z])/g, ' $1').trim()} className="dark" key={sound} value={sound}>
                      {sound.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </Select>

                <h3 className="mt-6">Select End Sound</h3>
                <Select
                  className=""
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "text-white p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select End Sound"
                  placeholder="Select End Sound"
                  defaultSelectedKeys={[selectedEndSound]}
                  onChange={(event) => setSelectedEndSound(event.target.value)} 
                  value={selectedEndSound}
                >
                  {Object.keys(endSounds).map(endSound => (
                    <SelectItem textValue={endSound.replace(/([A-Z])/g, ' $1').trim()} className="dark" key={endSound} value={endSound}>
                      <div className="flex justify-between items-center">
                        {endSound.replace(/([A-Z])/g, ' $1').trim()}
                        <Button
                          onPress={(e) => {
                            playEndSound(endSound); // Play the selected end sound
                          }}
                          isIconOnly
                          aria-label="Play Sound"
                          color="default"
                          variant="flat"
                          className="flex items-center justify-center"
                        >
                          <FontAwesomeIcon 
                            icon={faPlay}  
                            className="text-white w-5 h-5" 
                          />
                        </Button>
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                <h3 className="mt-6">Choose GIF Display</h3>
                <Select 
                  className=""
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "text-white p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select Background Gif"
                  placeholder="Select Background Gif"
                  onChange={(event) => setSelectedGif(event.target.value)} 
                  value={selectedGif}
                  defaultSelectedKeys={[selectedGif]}
                >
                  {Object.keys(gifs).map(gif => (
                    <SelectItem textValue={gif.replace(/([A-Z])/g, ' $1').trim()} className="dark" key={gif} value={gif}>
                      {gif.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </Select>
                <Checkbox isSelected={isStarsSelected} onValueChange={setIsStarsSelected} color="secondary" className="mt-6" >Background Stars?</Checkbox>

                <Button onPress={save} variant="faded" className="dark mt-6">Save Settings</Button>
                  
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
    </div>
  );
}
