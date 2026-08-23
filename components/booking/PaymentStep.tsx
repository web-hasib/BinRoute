"use client";

import React, { useState } from "react";
import { Loader2, ArrowLeft, ShieldCheck, Lock, CreditCard } from "lucide-react";
import PricingSidebar from "./PricingSidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PaymentStep = ({ onNext, onBack }: PaymentStepProps) => {
  const dispatch = useDispatch();
  const { clientSecret } = useSelector((state: RootState) => state.booking);
  
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let formattedValue = value;

    if (field === "number") {
      const digitsOnly = value.replace(/\D/g, "");
      const truncated = digitsOnly.slice(0, 16);
      formattedValue = truncated.replace(/(\d{4})/g, "$1 ").trim();
    } else if (field === "expiry") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length > 2) {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
      } else {
        if (value.endsWith('/') && value.length === 3) {
          formattedValue = digitsOnly + '/';
        } else {
          formattedValue = digitsOnly;
        }
      }
    } else if (field === "cvc") {
      const digitsOnly = value.replace(/\D/g, "");
      formattedValue = digitsOnly.slice(0, 4);
    }

    e.target.value = formattedValue;
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleCheckout = async () => {
    if (!clientSecret) {
      toast.error("Missing payment information. Please try starting the booking again.");
      return;
    }

    if (!cardData.number || !cardData.expiry || !cardData.cvc) {
      toast.error("Please fill in all card details.");
      return;
    }

    const cardNumberDigits = cardData.number.replace(/\D/g, "");
    if (cardNumberDigits.length !== 16) {
      toast.error("Card number must be 16 digits.");
      return;
    }

    const cvcDigits = cardData.cvc.replace(/\D/g, "");
    if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      toast.error("CVV must be 3 or 4 digits.");
      return;
    }

    let exp_month = "";
    let exp_year_short = "";
    
    const cleanExpiry = cardData.expiry.replace(/\s+/g, '');
    
    if (cleanExpiry.includes('/')) {
      [exp_month, exp_year_short] = cleanExpiry.split("/");
    } else if (cleanExpiry.length >= 4) {
      exp_month = cleanExpiry.substring(0, 2);
      exp_year_short = cleanExpiry.substring(2);
    }

    if (!exp_month || !exp_year_short || exp_month.length !== 2 || exp_year_short.length < 2) {
      toast.error("Please enter a valid expiry date (MM/YY or MM/YYYY).");
      return;
    }
    
    const exp_year = exp_year_short.length === 2 ? `20${exp_year_short}` : exp_year_short;

    setIsProcessing(true);

    try {
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error("Stripe configuration is missing.");
      }

      const authHeader = `Bearer ${stripeKey}`;

      // Step 1: Create Payment Method
      const pmHeaders = new Headers();
      pmHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      pmHeaders.append("Authorization", authHeader);

      const pmBody = new URLSearchParams();
      pmBody.append("type", "card");
      pmBody.append("card[number]", cardData.number.replace(/\s+/g, ''));
      pmBody.append("card[exp_month]", exp_month.trim());
      pmBody.append("card[exp_year]", exp_year.trim());
      pmBody.append("card[cvc]", cardData.cvc.trim());

      const pmResponse = await fetch("https://api.stripe.com/v1/payment_methods", {
        method: "POST",
        headers: pmHeaders,
        body: pmBody,
      });

      const pmResult = await pmResponse.json();

      if (pmResult.error) {
        throw new Error(pmResult.error.message);
      }

      const paymentMethodId = pmResult.id;

      // Step 2: Confirm Payment Intent
      const piId = clientSecret.split("_secret_")[0];
      
      const confirmHeaders = new Headers();
      confirmHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      confirmHeaders.append("Authorization", authHeader);

      const confirmBody = new URLSearchParams();
      confirmBody.append("payment_method", paymentMethodId);
      confirmBody.append("client_secret", clientSecret);

      const confirmResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}/confirm`, {
        method: "POST",
        headers: confirmHeaders,
        body: confirmBody,
      });

      const confirmResult = await confirmResponse.json();

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message);
      }

      if (confirmResult.status === "succeeded" || confirmResult.status === "requires_action") {
        toast.success("Payment successful!");
        onNext();
      } else {
        throw new Error("Payment failed or requires further action.");
      }

    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "An error occurred during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-8 space-y-6">
        <button 
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0060AF] transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Placement & Schedule</span>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0060AF]">
                Step 3
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Secure Credit Card Payment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Processed with 256-bit SSL encryption via Stripe.
              </p>
            </div>
            <div className="size-10 rounded-xl bg-blue-50 text-[#0060AF] flex items-center justify-center border border-blue-100 shrink-0">
              <Lock className="size-5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Name on Card</label>
              <input
                type="text"
                placeholder="Cardholder Full Name"
                value={cardData.name}
                onChange={(e) => handleInputChange("name", e)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardData.number}
                  onChange={(e) => handleInputChange("number", e)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                />
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Expiration Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => handleInputChange("expiry", e)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 text-center font-mono focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Security CVC / CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardData.cvc}
                  onChange={(e) => handleInputChange("cvc", e)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 text-center font-mono focus:bg-white focus:ring-2 focus:ring-[#0060AF]/20 focus:border-[#0060AF] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Guaranteed zero unauthorized charges • PCI-DSS Level 1 Certified</span>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
          buttonText={isProcessing ? "Authorizing Payment..." : "Complete Booking"}
          onButtonClick={handleCheckout}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
