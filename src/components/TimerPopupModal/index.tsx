import React from "react";
import { Modal, ModalBody, ModalContent, Button } from "@nextui-org/react";

interface TimerPopupModalProps {
  isPopupOpen: boolean;
  type: "continue" | "end";
  onClose: () => void;
  onConfirm: () => void;
}

const TimerPopupModal: React.FC<TimerPopupModalProps> = ({ isPopupOpen, type, onClose, onConfirm }) => {
  return (
    <Modal classNames={{backdrop: "backdrop-blur-sm"}} backdrop="blur" placement="center" className="dark" isOpen={isPopupOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="p-6 gap-4">
          {type === "continue" ? (
            <>
              <h2 className="text-white text-2xl font-semibold">Continue Session</h2>
              <p className="text-textcolor">Do you want to continue from where you left off or end the timer?</p>
              <div className="flex justify-center gap-4">
                <Button variant="shadow" className="dark" color="secondary" onPress={onConfirm}>
                  Continue
                </Button>
                <Button variant="shadow" className="dark" color="default" onPress={onClose}>
                  End Timer
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-2xl font-semibold">End Session</h2>
              <p className="text-textcolor">Warning: The session will be marked as failed if you continue. Are you sure?</p>
              <div className="flex justify-center gap-4">
                <Button variant="shadow" className="dark" color="secondary" onPress={onConfirm}>
                  Continue
                </Button>
                <Button variant="shadow" className="dark" color="default" onPress={onClose}>
                  Go Back
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TimerPopupModal;
