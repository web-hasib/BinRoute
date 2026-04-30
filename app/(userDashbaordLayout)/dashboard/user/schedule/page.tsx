"use client";

import React, { useState } from "react";
import ScheduleTimeline from "@/components/sections/dashboard/ScheduleTimeline";
import ScheduleCalendar from "@/components/sections/dashboard/ScheduleCalendar";

export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState("roll");

    return (
        <main className="bg-gray-50/50 min-h-screen">
            <div className="flex flex-col gap-8">
                <ScheduleTimeline activeTab={activeTab} setActiveTab={setActiveTab} />
                <ScheduleCalendar />
            </div>
        </main>
    );
}
