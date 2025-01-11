import { useState } from "react";

interface LoadingPageProps {
    isPageLoading: boolean;
}

export default function LoadingPage({ isPageLoading }: LoadingPageProps) {
    return (
        <div className={`${isPageLoading ? "flex" : "hidden"} absolute inset-0 items-center justify-center w-screen h-screen text-textcolor bg-dark1 z-[150]`}>
            <div className="flex items-center justify-center w-fit h-fit gap-2">
                <div className="dot animate-dot1"></div>
                <div className="dot animate-dot2"></div>
                <div className="dot animate-dot3"></div>
            </div>
        </div>
    );
}
