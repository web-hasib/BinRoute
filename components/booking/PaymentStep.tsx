import React, { useState } from "react";
import { Calendar, CreditCard, Loader2 } from "lucide-react";
import PricingSidebar from "./PricingSidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

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

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
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

    let exp_month = "";
    let exp_year_short = "";
    
    // Clean input: remove spaces
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
    
    // Convert YY to YYYY if necessary
    const exp_year = exp_year_short.length === 2 ? `20${exp_year_short}` : exp_year_short;

    setIsProcessing(true);

    try {
      // Ensure we have the publishable key
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
      <div className="lg:col-span-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0265AF] transition-colors mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Information
        </button>

        <div className="bg-white p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#0c243c] mb-8">Payment Method</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={cardData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => handleInputChange("expiry", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="****"
                  value={cardData.cvc}
                  onChange={(e) => handleInputChange("cvc", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none text-sm focus:ring-1 focus:ring-[#0265AF] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing Sidebar */}
      <div className="lg:col-span-4">
        <PricingSidebar 
           buttonText={isProcessing ? "Processing..." : "Checkout"}
           onButtonClick={handleCheckout}
        />
      </div>
    </div>
  );
};

export default PaymentStep;
