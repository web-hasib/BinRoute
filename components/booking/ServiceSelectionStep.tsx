"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Wrench, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { setServiceType, setDumpsterSize } from "@/feature/user/bookingSlice";

interface ServiceSelectionStepProps {
  onNext: () => void;
}

const serviceTypes = [
  {
    id: "roll-off",
    title: "Roll of Dumpster Service",
    description:
      "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Wrench,
  },
  {
    id: "commercial",
    title: "Commercial Service",
    description:
      "Robust disposal for renovations and job sites, managing concrete, wood, and metal.",
    icon: Building2,
  },
];

const dumpsterSizes = [
  {
    id: "10-yard",
    title: "10 Yard Dumpster",
    price: 450,
    capacity: "1 Ton",
    details: ["-60 large trash bags, or", "-4 pickup truck loads"],
    note: "Delivery and rental fees may apply.",
    image: "/dummy.png",
  },
  {
    id: "15-yard",
    title: "15 Yard Dumpster",
    price: 550,
    capacity: "1.5 Ton",
    details: ["-90 large trash bags, or", "-6 pickup truck loads"],
    note: "Delivery and rental fees may apply.",
    image: "/dummy.png",
  },
  {
    id: "20-yard",
    title: "20 Yard Dumpster",
    price: 650,
    capacity: "2 Ton",
    details: ["-120 large trash bags, or", "-8 pickup truck loads"],
    note: "Delivery and rental fees may apply.",
    image: "/dummy.png",
  },
  {
    id: "30-yard",
    title: "30 Yard Dumpster",
    price: 850,
    capacity: "3 Ton",
    details: ["-180 large trash bags, or", "-14 pickup truck loads"],
    note: "Delivery and rental fees may apply.",
    image: "/dummy.png",
  },
];

const ServiceSelectionStep = ({ onNext }: ServiceSelectionStepProps) => {
  const dispatch = useDispatch();
  const { serviceType, dumpsterSize } = useSelector(
    (state: RootState) => state.booking,
  );
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="space-y-8">
      {/* Service Type Selection */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-[#0c243c] mb-6">
          Select Your Service
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map((service) => {
            const isSelected = serviceType === service.id;
            return (
              <div
                key={service.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => dispatch(setServiceType(service.id as any))}
                className={cn(
                  "relative flex items-center gap-4 p-6 border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-[#0265AF] bg-white"
                    : "border-gray-100 hover:border-gray-200",
                )}
              >
                <div className="bg-gray-50 p-3">
                  <service.icon className="w-6 h-6 text-[#0c243c]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0c243c]">{service.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[250px]">
                    {service.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#0265AF]">
                    <CheckCircle2 className="w-5 h-5 fill-current text-white bg-[#0265AF] rounded-full" />
                  </div>
                )}
                {!isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 border-2 border-gray-200 rounded-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dumpster Size Selection */}
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-[#0c243c] mb-6">
          Select Dumpster Size
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dumpsterSizes.map((size) => {
            const isSelected = dumpsterSize === size.id;
            return (
              <div
                key={size.id}
                onClick={() =>
                  dispatch(setDumpsterSize({ id: size.id, price: size.price }))
                }
                className={cn(
                  "relative flex gap-6 p-6 border-2 transition-all cursor-pointer",
                  isSelected
                    ? "border-[#0265AF]"
                    : "border-gray-100 hover:border-gray-200",
                )}
              >
                <div className="w-32 h-24 relative flex-shrink-0 bg-gray-50 overflow-hidden">
                  <Image
                    src="/dummy.png"
                    alt={size.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-[#0c243c]">{size.title}</h4>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Price : </span>
                    <span className="text-[#0265AF] font-bold">
                      Starting at ${size.price}
                    </span>
                  </p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-xs text-gray-500">
                      Capacity: {size.capacity}
                    </p>
                    {size.details.map((detail, i) => (
                      <p key={i} className="text-xs text-gray-500">
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">{size.note}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#0265AF]">
                    <CheckCircle2 className="w-5 h-5 fill-current text-white bg-[#0265AF] rounded-full" />
                  </div>
                )}
                {!isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 border-2 border-gray-200 rounded-sm" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Banner */}
      {serviceType && dumpsterSize && (
        <div className="bg-[#EBF6FF] p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h4 className="font-bold text-[#0c243c]">
              Selected : {serviceTypes.find((s) => s.id === serviceType)?.title}{" "}
              - {dumpsterSizes.find((d) => d.id === dumpsterSize)?.title}
            </h4>
            <p className="text-sm text-gray-600">
              Discover our top-notch commercial services
            </p>
          </div>
          <Button
            onClick={onNext}
            className="bg-[#0265AF] hover:bg-[#004d85] text-white px-8 py-6 rounded-none font-bold"
          >
            {user ? "Continue your booking" : "Log in to continue your booking"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelectionStep;
