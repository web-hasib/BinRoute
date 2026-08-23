"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import StepProgress from "./StepProgress";
import ServiceSelectionStep from "./ServiceSelectionStep";
import InformationStep from "./InformationStep";
import PaymentStep from "./PaymentStep";
import SuccessModal from "./SuccessModal";

const BookingFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header matching images */}
      <div className="bg-white border-b border-gray-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors transition-transform active:scale-90"
          >
            <ArrowLeft className="w-6 h-6 text-[#0c243c]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0c243c]">
            Add New Booking Service
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Stepper */}
        <StepProgress currentStep={currentStep} />

        {/* Steps */}
        <div className="min-h-[600px]">
          {currentStep === 1 && (
            <ServiceSelectionStep onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <InformationStep onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <PaymentStep onNext={handleNext} onBack={handleBack} />
          )}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal 
          onBackToDashboard={() => router.push("/dashboard/booking")}
          onBookAgain={() => {
            setShowSuccessModal(false);
            setCurrentStep(1);
          }}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default BookingFlow;
