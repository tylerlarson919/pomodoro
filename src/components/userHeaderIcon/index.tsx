"use client";

import React, { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Avatar, AvatarIcon } from "@nextui-org/avatar";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // Import signOut
import { auth, getStreak } from "../../../firebase"; // Adjust the path if necessary
import { useRouter } from "next/navigation";
import { add, set } from "lodash";
import SettingsModal from "../SettingsModal";
import SettingsIcon from "../../../public/icons/settings"
import LogOutIcon from "../../../public/icons/log-out"
import RepeatIcon from "../../../public/icons/repeat"

interface UHeaderIconProps {
    onTriggerReload: () => void; // Function to handle reload trigger
    settingsProps: {
      selectedSound: string;
      selectedEndSound: string;
      selectedGif: string;
      selectedBackground: string;
      isStarsSelected: boolean;
    };
    isModalOpen?: boolean;
  }

type ReplaceSpacesProps = {
    input: string;
  };

  export default function UHeaderIcon({ onTriggerReload, settingsProps }: UHeaderIconProps) {
    const [user, setUser] = useState<null | User>(null);
    const [isDropdownVisable, setIsDropdownVisable] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [currentStreak, setCurrentStreak] = useState<number | null>(null);
    const [isHelpMenuVisible, setIsHelpMenuVisible] = useState(false);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            setUser(currentUser);
            fetchStreak();
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const fetchStreak = async () => {
        try {
            const streak = await getStreak();
            setCurrentStreak(streak);
        } catch (error) {
            console.error("Failed to fetch streak", error);
        }
    };


    useEffect(() => {
        if (isModalOpen) {
            setIsDropdownVisable(false);
        }
    }, [isModalOpen]);

    
    const handleLogout = async () => {
        setIsDropdownVisable(false);
        try {
            await signOut(auth); // Sign out from Firebase
            router.push("/login"); 
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const handleSettings = () => {
        setIsModalOpen(prevstate => !prevstate);
        setIsDropdownVisable(false);
    };

    const upgradePlan = () => {
        setIsDropdownVisable(false);
        router.push("/upgrade");
    };

    const ReplaceSpaces: React.FC<ReplaceSpacesProps> = ({ input }) => {
        const replaceSpaces = (str: string) => str.replace(/\s+/g, '+');
        return replaceSpaces(input);
    };

    

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            const dropdownMenu = document.getElementById("dropdown-menu");
            const userProfile = document.getElementById("user-profile");

            if (
                dropdownMenu &&
                userProfile &&
                !dropdownMenu.contains(event.target as Node) &&
                !userProfile.contains(event.target as Node)
            ) {
                setIsDropdownVisable(false);
                console.log("clicked outside");
            }
        };
        if (isDropdownVisable) {
            addEventListener('click', handleClickOutside);
        }
    }, [isDropdownVisable]);

    const onAvatarClick = () => {
        setIsDropdownVisable(prevstate => !prevstate);
        console.log("dropdown clicked");

    };

    return (
        <div className="absolute top-4 right-4 z-[39]">
            <div className="flex flex-row gap-2 items-center justify-center">
                <div 
                    className="relative"
                    onMouseEnter={() => setIsHelpMenuVisible(true)} // Show menu on mouse enter
                    onMouseLeave={() => setIsHelpMenuVisible(false)} // Hide menu on mouse leave
                    onClick={() => setIsHelpMenuVisible(prevState => !prevState)}
                >
                    {/* Streak Display */}
                    <div
                        className="bg-white/10 hover:bg-white/15 drop-shadow-lg p-2 rounded-full cursor-pointer transition-all duration-300"
                        
                    >
                        <p className="text-textcolor font-bold">🔥 {currentStreak ? currentStreak : 0}</p>
                    </div>

                    {/* Hover Menu */}
                    {isHelpMenuVisible && ( // Conditionally render the menu
                    <div 
                    className={`bg-darkaccent3/30 backdrop-blur-sm drop-shadow-sm p-2 rounded-lg w-56 absolute -left-8 transform -translate-x-1/2 top-full mt-2 transition-opacity duration-300 ${isHelpMenuVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    >
                        <p className="text-sm font-medium text-textcolor">
                            Your current streak is <span className="font-bold text-white">{currentStreak}</span> days!
                        </p>
                        <p className="text-xs text-textcolor mt-1">Keep it going to build a longer streak!</p>
                    </div>  
                    )}
                </div>
                <Avatar
                    isFocusable={true}
                    className="cursor-pointer "
                    alt="User Profile"
                    id="user-profile"
                    src={user?.photoURL || `https://eu.ui-avatars.com/api/?name=${ReplaceSpaces({ input: user?.displayName || "Anonymous" })}&size=250`}
                    onClick={onAvatarClick}
                />
                {isDropdownVisable && (
                    <div
                        id="dropdown-menu"
                        className="absolute right-0 top-12 z-[39] rounded-lg w-[160px] p-3 bg-darkaccent3/30 backdrop-blur-sm drop-shadow-sm"
                    >
                        <div className="flex flex-col p-2">
                            <p className="font-semibold text-textcolor text-xs">Signed in as</p>
                            <p className="font-semibold text-white text-sm">Rick</p>
                        </div>
                        <div
                            className="p-2 text-textcolor cursor-pointer hover:bg-darkaccent2 text-sm font-semibold cursor-pointer rounded-lg gap-2 flex flex-row items-center"
                            onClick={handleSettings}
                        >
                            <SettingsIcon color="#939393" className="w-5 h-5"/>
                            <p>Settings</p>
                        </div>
                        <div
                            className="p-2 text-textcolor cursor-pointer hover:bg-darkaccent2 text-sm font-semibold cursor-pointer rounded-lg gap-2 flex flex-row items-center"
                            onClick={upgradePlan}
                        >
                            <RepeatIcon color="#939393" className="w-5 h-5"/>
                            Upgrade Plan
                        </div>
                        <div
                            className="p-2 text-textcolor cursor-pointer hover:bg-darkaccent2 text-sm font-semibold cursor-pointer rounded-lg gap-2 flex flex-row items-center"
                            onClick={handleLogout}
                        >
                            <LogOutIcon color="#939393" className="w-5 h-5"/>
                            Log Out
                        </div>
                    </div>
                )}
                <SettingsModal 
                    isModalOpen={isModalOpen}
                    onTriggerReload={() => {
                    setIsModalOpen(false);
                    onTriggerReload();
                        }} 
                    settingsProps={settingsProps}
                />
            </div>
        </div>
    );
}
