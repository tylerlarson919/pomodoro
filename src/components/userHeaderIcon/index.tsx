"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Image } from "@nextui-org/image";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { onAuthStateChanged, User, signOut } from "firebase/auth"; // Import signOut
import { auth } from "../../../firebase"; // Adjust the path if necessary
import { useRouter } from "next/navigation";

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
    ssr: false,
});

export default function UHeaderIcon() {
    const [user, setUser] = useState<null | User>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
            router.push("/login"); 
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <div className="fixed top-2.5 right-2.5 z-[200] p-2">
            <Dropdown 
                classNames={{ content: "w-min" }} 
                placement="bottom-end" 
                className="dark"
            >
                <DropdownTrigger>
                    <Image
                        className="w-10 h-10 rounded-full border-3 border-textcolor/70 hover:border-textcolor/80 cursor-pointer"
                        alt="User Profile"
                        src={user?.photoURL || "https://via.placeholder.com/40"}
                        height={35}
                    />
                </DropdownTrigger>
                <DropdownMenu  
                    classNames={{ list: "text-right" }} 
                    className="dark" 
                    aria-label="Profile Actions" 
                    variant="flat"
                >
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-semibold text-textcolor">Signed in as</p>
                        <p className="font-semibold text-white">{user?.displayName}</p>
                    </DropdownItem>
                    <DropdownItem 
                        key="logout" 
                        className="text-textcolor" 
                        onPress={handleLogout} // Call handleLogout on click
                    >
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
