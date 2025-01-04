"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/avatar";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // Import signOut
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { useRouter } from "next/navigation";
import SettingsIcon from "../../../public/icons/settings";
import LogOutIcon from "../../../public/icons/log-out";
import RepeatIcon from "../../../public/icons/repeat";
import ClockIcon from "../../../public/icons/clock";


interface UHeaderIconProps {
    isModalOpen?: boolean;
  }

type ReplaceSpacesProps = {
    input: string;
  };

  export default function UserHeaderIconMainPage({}: UHeaderIconProps) {
    const [user, setUser] = useState<null | User>(null);
    const [isDropdownVisable, setIsDropdownVisable] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [currentStreak, setCurrentStreak] = useState<number | null>(null);
    const [isHelpMenuVisible, setIsHelpMenuVisible] = useState(false);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            setUser(currentUser);
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);




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

    const upgradePlan = () => {
        setIsDropdownVisable(false);
        router.push("/upgrade");
    };

    const timerClick = () => {
        setIsDropdownVisable(false);
        router.push("/timer");
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
        <div className="absolute right-10 z-[39]">
            <div className="relative flex flex-row gap-2 items-center justify-center">
                <Avatar
                    isFocusable={true}
                    className="relative cursor-pointer "
                    alt="User Profile"
                    id="user-profile"
                    src={user?.photoURL || `https://eu.ui-avatars.com/api/?name=${ReplaceSpaces({ input: user?.displayName || "Anonymous" })}&size=250`}
                    onClick={onAvatarClick}
                />
                {isDropdownVisable && (
                    <div
                        id="dropdown-menu"
                        className="absolute right-0 top-12 z-[39] rounded-lg w-[160px] p-3 bg-darkaccent3 drop-shadow-sm"
                    >
                        <div className="flex flex-col p-2">
                            <p className="font-semibold text-textcolor text-xs">Signed in as</p>
                            <p className="font-semibold text-white text-sm">{user?.displayName}</p>
                        </div>
                        <div
                            className="p-2 text-textcolor cursor-pointer hover:bg-darkaccent2 text-sm font-semibold cursor-pointer rounded-lg gap-2 flex flex-row items-center"
                            onClick={timerClick}
                        >
                            <ClockIcon color="#939393" className="w-5 h-5"/>
                            Go to Timer
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
            </div>
        </div>
    );
}
