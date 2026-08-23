import React from "react";
import Container from "@/components/ui/container";
import SettingsTabs from "@/components/dashboard/settings/SettingsTabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-8 bg-[#F8FAFC] min-h-screen">
      <div className="mb-0">
        <h1 className="text-2xl font-bold text-[#172C41] mb-8">Admin Profile</h1>
        <SettingsTabs />
      </div>
      <div>
        {children}
      </div>
    </Container>
  );
}
