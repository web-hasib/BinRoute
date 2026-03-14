"use client";

import React from "react";
import { Check } from "lucide-react";
import { Button } from "./button";
import Modal from "./Modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message,
  buttonText = "Back to Profile",
  onButtonClick,
}: SuccessModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false}
      className=" p-0"
    >
      <div className="flex flex-col items-center text-center p-8 py-12">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="size-24 bg-[#22C55E] rounded-full flex items-center justify-center">
            <Check className="size-12 text-white stroke-[3px]" />
          </div>
          {/* Decorative outer circles like in the image */}
          <div className="absolute -inset-2 border-2 border-[#22C55E]/20 rounded-full" />
          <div className="absolute -inset-4 border-2 border-[#22C55E]/10 rounded-full" />
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold text-[#172C41] mb-4">{title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 px-6">
          {message}
        </p>

        {/* Button */}
        <Button 
          onClick={onButtonClick || onClose}
          className="w-full bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg"
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
