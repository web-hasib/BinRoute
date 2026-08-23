"use client";

import React from "react";

interface CreditCardViewProps {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cardType: "VISA" | "MASTERCARD";
}

const CreditCardView = ({ cardHolder, cardNumber, expiryDate, cardType }: CreditCardViewProps) => {
  return (
    <div className="bg-[#0c243c] p-8 relative overflow-hidden group">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px]">Card User</p>
            <h3 className="text-xl font-black text-white italic tracking-wider">{cardType}</h3>
          </div>
          <div className="flex gap-2">
            <div className="size-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="size-4 border-2 border-white/50 rounded-full flex items-center justify-center">
                    <div className="size-1 bg-white/50 rounded-full"/>
                </div>
            </div>
          </div>
        </div>

        <div className="my-8">
          <p className="text-xl font-bold text-white tracking-[4px] font-mono">
            **** **** **** <span className="text-white/90">{cardNumber.slice(-4)}</span>
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Card Holder</p>
            <p className="text-sm font-bold text-white uppercase tracking-wide">{cardHolder}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Expire</p>
            <p className="text-sm font-bold text-white tracking-widest">{expiryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardView;
