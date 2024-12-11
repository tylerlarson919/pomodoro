"use client";

import dynamic from "next/dynamic";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, Select, SelectSection, SelectItem, Button } from "@nextui-org/react";
import { sounds, gifs, endSounds } from "./assets"; // Adjust path as necessary



const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
  });

  interface SettingsModalProps {
    onTriggerReload: (value: boolean) => void; // Function to handle reload trigger
  }
  
  export default function SettingsModal({ onTriggerReload }: SettingsModalProps) {
  
    const [showModal, setShowModal] = useState(false);
    const [selectedSound, setSelectedSound] = useState("");
    const [selectedEndSound, setSelectedEndSound] = useState("");
    const [selectedGif, setSelectedGif] = useState("");



    const save = () => {
      localStorage.setItem("selectedSound", selectedSound);
      localStorage.setItem("selectedEndSound", selectedEndSound);
      localStorage.setItem("selectedGif", selectedGif);
      
      // Trigger reload
      onTriggerReload(true);
      setTimeout(() => onTriggerReload(false), 100); // Reset to false after 100ms
  
      setShowModal(false); // Close modal after saving
    };


  useEffect(() => {
    const savedSound = localStorage.getItem("selectedSound");
    const savedEndSound = localStorage.getItem("selectedEndSound");
    const savedGif = localStorage.getItem("selectedGif");

    if (savedSound) {
        setSelectedSound(savedSound);
    }
    if (savedEndSound) {
      setSelectedEndSound(savedEndSound);
  }
    if (savedGif) {
        setSelectedGif(savedGif);
    }
  }, []);
    


  return (
    <div className="absolute top-4 left-4">
        <FontAwesomeIcon 
          icon={faBars}  
          className="cursor-pointer text-white w-7 h-7 mt-2" 
          onClick={() => setShowModal(true)}
        /> 
        {showModal && (
            <Modal className="dark" placement="center" isOpen={showModal} onClose={() => setShowModal(false)}>
              <ModalContent>
                <ModalBody className="p-10 bg-darkaccent text-textcolor">

                <h3>Select Background Sound</h3>
                <Select
                  className="dark"
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select Background Sound"
                  placeholder={selectedSound ? selectedSound : 'Select Sound'}
                  onChange={(event) => setSelectedSound(event.target.value)} 
                  value={selectedSound}
                >
                  {Object.keys(sounds).map(sound => (
                    <SelectItem className="dark" key={sound} value={sound}>
                      {sound.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </Select>

                <h3 className="mt-6">Select End Sound</h3>
                <Select
                  className="dark"
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select End Sound"
                  placeholder={selectedEndSound ? selectedEndSound : 'Select Sound'}
                  onChange={(event) => setSelectedEndSound(event.target.value)} 
                  value={selectedEndSound}
                >
                  {Object.keys(endSounds).map(endSound => (
                    <SelectItem className="dark" key={endSound} value={endSound}>
                      {endSound.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </Select>

                <h3 className="mt-6">Choose GIF Display</h3>
                <Select 
                  className="dark"
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider dark border-none",
                    },
                  }}
                  aria-label="Select Background Gif"
                  placeholder={selectedGif ? selectedGif : 'Select GIF'}
                  onChange={(event) => setSelectedGif(event.target.value)} 
                  value={selectedGif}
                >
                  {Object.keys(gifs).map(gif => (
                    <SelectItem className="dark" key={gif} value={gif}>
                      {gif.replace(/([A-Z])/g, ' $1').trim()}
                    </SelectItem>
                  ))}
                </Select>
                <Button onPress={save} variant="faded" className="dark mt-6">Save Settings</Button>
                  
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
    </div>
  );
}
