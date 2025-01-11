"use client";

import React, { useEffect, useState } from "react";
import { NextPage } from 'next';
import CheckIcon from "../../../public/icons/check-mark"
import { Button, Tabs, Tab } from "@nextui-org/react";

const PricingSection: NextPage = () => {


    const getStarted = () => {
        window.location.href = "/get-started";
      };
      const getStartedFree = () => {
        window.location.href = "/signup";
      };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-full flex flex-col md:grid md:grid-cols-2 gap-4" >
                <div className="z-10 border-2 sticky-card-pricing border-darkaccent3 border-2 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                    <div className="flex flex-col text-center items-center justify-center gap-4">
                        <p className="text-sm text-textcolor">Beginner</p>
                        <p className="text-4xl text-white">Free</p>
                        <p className="text-sm text-textcolor">Start improving your focus skills</p>
                    </div>
                    <div className="text-left flex flex-col items-start justify-center text-white">
                        <div className="flex flex-row gap-4">
                            <CheckIcon color="white"/>
                            <p>Trial Duration: 7-days</p>
                        </div>
                    </div>
                    <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm" onPress={getStartedFree}>Get Started</Button>
                </div>
                <div className="z-10 border-2 sticky-card-pricing border-darkaccent3 border-2 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                    <div className="flex flex-col text-center items-center justify-center gap-4">
                        <p className="text-sm text-textcolor">Pro</p>
                        <div className="flex flex-row items-end">
                            <p className="text-4xl text-white">$9.99</p>
                            <p className="text-md text-textcolor">/one time</p>
                        </div>
                        <p className="text-sm text-textcolor">Everything you need to achieve max zen</p>
                    </div>
                    <div className="text-left flex flex-col items-start justify-center text-white">
                        <div className="flex flex-row gap-4">
                            <CheckIcon color="white"/>
                            <p>No ads</p>
                        </div>
                        <div className="flex flex-row gap-4">
                            <CheckIcon color="white"/>
                            <p>All photos and sounds unlocked</p>
                        </div>
                        <div className="flex flex-row gap-4">
                            <CheckIcon color="white"/>
                            <p>Upload your own photos to use</p>
                        </div>
                    </div>
                    <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm" onPress={getStarted}>Get Started</Button>
                </div>
            </div> 
        </div>
    );
};

export default PricingSection;
