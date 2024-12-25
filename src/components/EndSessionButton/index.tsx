import React from "react";
import XIcon from "../../../public/icons/x-icon"


interface TimerPopupModalProps {
  onPress: () => void;
}

const TimerPopupModal: React.FC<TimerPopupModalProps> = ({ onPress }) => {
  return (
    <div className="absolute top-[1.15rem] right-[1.15rem] z-[39] cursor-pointer hover:scale-110 transition-all" onClick={onPress}>
        <XIcon color="red"  width={"34"} height={"34"} />
    </div>
  );
};

export default TimerPopupModal;
