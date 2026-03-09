"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
    {
        question: "How long can I keep the dumpster?",
        answer:
            "Our standard rental period is 7 to 10 days, depending on your specific needs and the type of project. If you require the dumpster for a longer duration, just let us know, and we can arrange an extension for a small daily fee.",
    },
    {
        question: "What dumpster sizes do you offer?",
        answer:
            "We offer a variety of sizes to suit different projects, including 10-yard, 15-yard, and 20-yard dumpsters. Our team can help you choose the right size based on the volume and weight of your debris.",
    },
    {
        question: "How do I book a dumpster?",
        answer:
            "You can book a dumpster by calling us directly or filling out the contact form on our website. We'll confirm the size, delivery date, and pricing with you.",
    },
    {
        question: "How fast can you deliver?",
        answer:
            "We typically offer same-day or next-day delivery depending on availability in the Worcester area.",
    },
    {
        question: "Where do you place the dumpster?",
        answer:
            "We usually place the dumpster on a flat, hard surface like a driveway. We use protective boards to prevent any damage to your property.",
    },
    {
        question: "Do I need to be home for delivery?",
        answer:
            "No, as long as the delivery area is clear and accessible, you don't need to be present.",
    },
    {
        question: "What can I put in the dumpster?",
        answer:
            "You can put most household junk, construction debris, yard waste, and general clutter. Items like appliances, furniture, and renovation waste are all acceptable.",
    },
    {
        question: "What items are not allowed in the dumpster?",
        answer:
            "Hazardous materials, tires, batteries, liquids, and certain electronics are generally not allowed. Please contact us for a full list of prohibited items.",
    },
    {
        question: "Do you protect my driveway?",
        answer:
            "Yes, we place wooden boards under the dumpster's wheels and contact points to protect your driveway from scratches or pressure marks.",
    },
    {
        question: "How much does it cost to rent a dumpster?",
        answer:
            "Pricing depends on the size of the dumpster and the type of waste. We provide transparent, all-inclusive pricing with no hidden fees.",
    },
    {
        question: "Do you offer service to contractors?",
        answer:
            "Yes, we provide reliable dumpster solutions for contractors and construction sites with flexible scheduling.",
    },
    {
        question: "Do you offer commercial service?",
        answer:
            "Yes, we serve local businesses and commercial properties with customized waste management solutions.",
    },
    {
        question: "What towns do you serve?",
        answer:
            "We serve Greater Worcester and surrounding towns in Central Massachusetts.",
    },
    {
        question: "How do I pay?",
        answer:
            "We accept major credit cards and other convenient payment methods upon delivery or at the time of booking.",
    },
    {
        question: "What happens if I fill the dumpster early?",
        answer:
            "Simply give us a call! We can arrange an early pickup or swap the full dumpster for an empty one.",
    },
    {
        question: "Can I move the dumpster?",
        answer:
            "For safety and property protection, we ask that you do not attempt to move the dumpster yourself. If you need it repositioned, please contact us.",
    },
    {
        question: "What if the dumpster is overweight?",
        answer:
            "Each dumpster size has a specified weight limit. If the limit is exceeded, an additional tonnage fee may apply. We'll explain these details during booking.",
    },
    {
        question: "Can I rent more than one dumpster at a time?",
        answer:
            "Absolutely! We can deliver multiple dumpsters to your location depending on the scale of your project.",
    },
];

const FAQAccordion = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-sm overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <span className="text-lg md:text-xl font-bold text-[#0A2540]">
                                    {item.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="size-6 text-[#0061AA]" />
                                ) : (
                                    <ChevronDown className="size-6 text-[#0061AA]" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-gray-600 leading-relaxed md:text-lg">
                                        {item.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQAccordion;
