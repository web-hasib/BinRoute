"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}: ModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl transition-all transform",
        className
      )}>
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-start justify-between">
            <div>
              {title && <h2 className="text-2xl font-bold text-[#172C41]">{title}</h2>}
              {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="p-3 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
