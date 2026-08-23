"use client";

import { useState } from "react";
import Container from "@/components/ui/container";
import { AdminInfo } from "./AdminInfo";
import { AdminManagement } from "./AdminManagement";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"info" | "management">("info");

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Admin Profile</h1>
        
        <div className="flex items-center bg-gray-50 border border-gray-100 p-1 w-fit">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-2 text-sm font-medium transition-all ${
              activeTab === "info"
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Admin Info
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`px-6 py-2 text-sm font-medium transition-all ${
              activeTab === "management"
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            Admin Management
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "info" ? <AdminInfo /> : <AdminManagement />}
      </div>
    </Container>
  );
}
