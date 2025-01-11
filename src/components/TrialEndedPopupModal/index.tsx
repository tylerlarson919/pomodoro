import { useState } from "react";
import { Button, Image } from "@nextui-org/react";

interface TrialEndedPopupModalProps {
    isPageVisable: boolean;
}

export default function TrialEndedPopupModal({ isPageVisable }: TrialEndedPopupModalProps) {
    return (
        isPageVisable ? ( // Remove curly braces
    <div className="flex absolute inset-0 items-center justify-center w-screen h-screen bg-dark1 z-[200] px-4">
        <div className="absolute top-0 w-full flex justify-center pt-4">
          <Image
              disableSkeleton
              className="dark height-fit hover:cursor-pointer"
              src="./logo/focus-flow-logo-white.png"
              alt="Focus Flow logo"
              width={130}
          />
        </div>
    <div className="h-fit flex flex-col gap-8 max-w-md text-center px-4 py-8 bg-darkaccent3 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white">Your Trial Has Ended</h1>
        <p className="text-textcolor text-lg mb-4">
            We're sorry, but your trial period has ended. To continue using FocusFlow, please upgrade to a paid plan. We hope to see you back soon!
        </p>
        <Button color="secondary" variant="solid" className="">
            Upgrade Now
        </Button>

    </div>
</div>

        ) : null 
    );
}
