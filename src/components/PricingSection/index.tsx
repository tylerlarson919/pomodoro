"use client";

import React, { useEffect, useState } from "react";
import { NextPage } from 'next';
import CheckIcon from "../../../public/icons/check-mark"
import { Button, Tabs, Tab } from "@nextui-org/react";

const PricingSection: NextPage = () => {

    return (
        <div className="w-full h-full flex flex-col">
            <Tabs aria-label="Options" className="dark" classNames={{base: "justify-center"}}>
                <Tab key="monthly" title="Monthly">
                    <div className="w-full h-full flex flex-col md:grid md:grid-cols-2 gap-4" >
                        <div className="border-2 border-darkaccent3 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                            <div className="flex flex-col text-center items-center justify-center gap-4">
                                <p className="text-sm text-textcolor">Beginner</p>
                                <p className="text-4xl text-white">Free</p>
                                <p className="text-sm text-textcolor">Start improving your focus skills</p>
                            </div>
                            <div className="text-left flex flex-col items-start justify-center text-white">
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>Ads</p>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>Limited pictures and sounds</p>
                                </div>
                            </div>
                            <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm">Get Started</Button>
                        </div>
                        <div className="border-2 border-darkaccent3 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                            <div className="flex flex-col text-center items-center justify-center gap-4">
                                <p className="text-sm text-textcolor">Pro</p>
                                <div className="flex flex-row items-end">
                                    <p className="text-4xl text-white">$9.99</p>
                                    <p className="text-md text-textcolor">/month</p>
                                </div>
                                <p className="text-sm text-textcolor">Everything you need to achieve max zen</p>
                            </div>
                            <div className="text-left flex flex-col items-start justify-center text-white">
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>No Ads</p>
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
                            <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm">Get Started</Button>
                        </div>
                    </div>
                </Tab>
                <Tab key="yearly" title="Yearly">
                    <div className="w-full h-full flex flex-col md:grid md:grid-cols-2 gap-4" >
                        <div className="border-2 border-darkaccent3 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                            <div className="flex flex-col text-center items-center justify-center gap-4">
                                <p className="text-sm text-textcolor">Beginner</p>
                                <p className="text-4xl text-white">Free</p>
                                <p className="text-sm text-textcolor">Start improving your focus skills</p>
                            </div>
                            <div className="text-left flex flex-col items-start justify-center text-white">
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>Ads</p>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>Limited pictures and sounds</p>
                                </div>
                            </div>
                            <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm">Get Started</Button>
                        </div>
                        <div className="border-2 border-darkaccent3 rounded-2xl p-4 w-full flex flex-col items-center justify-between gap-6 h-[300px]">
                            <div className="flex flex-col text-center items-center justify-center gap-4">
                                <p className="text-sm text-textcolor">Pro</p>
                                <div className="flex flex-row items-end">
                                    <p className="text-4xl text-white">$99.99</p>
                                    <p className="text-md text-textcolor">/year</p>
                                </div>
                                <p className="text-sm text-textcolor">Everything you need to achieve max zen</p>
                            </div>
                            <div className="text-left flex flex-col items-start justify-center text-white">
                                <div className="flex flex-row gap-4">
                                    <CheckIcon color="white"/>
                                    <p>No Ads</p>
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
                            <Button className="dark rounded-xl w-full" variant="faded" color="default" size="sm">Get Started</Button>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default PricingSection;
