"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";

import { setStep, updateContactInfo, setServiceType } from "@/feature/user/bookingSlice";
import StepProgress from "./StepProgress";
import ServiceSelectionStep from "./ServiceSelectionStep";
import InformationStep from "./InformationStep";
import PaymentStep from "./PaymentStep";
import SuccessModal from "./SuccessModal";

const BookingFlow = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentStep = useSelector((state: RootState) => state.booking.currentStep);
  const bookingData = useSelector((state: RootState) => state.booking);
  const user = useSelector((state: RootState) => state.user.user);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sync URL type to Redux
  const typeParam = searchParams.get("type");
  React.useEffect(() => {
    if (typeParam && (typeParam === "roll-off" || typeParam === "commercial")) {
      dispatch(setServiceType(typeParam));
    }
  }, [typeParam, dispatch]);

  const handleNextStep = () => {
    if (currentStep === 1 && !user) {
      const params = searchParams.toString();
      const callbackUrl = `/services/booking${params ? `?${params}` : ""}`;
      router.push(`/login?callback=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    
    // Pre-fill contact info if moving to Step 2 and info is empty
    if (currentStep === 1 && user) {
      const { contactInfo } = bookingData;
      if (!contactInfo.firstName && !contactInfo.email) {
        const [firstName = "", ...lastNameParts] = user.name.split(" ");
        dispatch(updateContactInfo({
          firstName,
          lastName: lastNameParts.join(" "),
          email: user.email,
        }));
      }
    }
    
    if (currentStep < 3) {
      dispatch(setStep(currentStep + 1));
    } else if (currentStep === 3) {
      setShowSuccessModal(true);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      dispatch(setStep(currentStep - 1));
    }
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <StepProgress currentStep={currentStep} />

        <div className="mt-12">
          {currentStep === 1 && (
            <ServiceSelectionStep onNext={handleNextStep} />
          )}
          {currentStep === 2 && (
            <InformationStep 
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
          {currentStep === 3 && (
            <PaymentStep 
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal 
          onClose={() => {
            setShowSuccessModal(false);
            router.push("/");
          }} 
        />
      )}
    </div>
  );
};

export default BookingFlow;
