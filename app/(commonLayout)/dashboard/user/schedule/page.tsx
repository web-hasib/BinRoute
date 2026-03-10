import UserSidebar from "@/components/sections/dashboard/UserSidebar";
import ScheduleTimeline from "@/components/sections/dashboard/ScheduleTimeline";
import ScheduleCalendar from "@/components/sections/dashboard/ScheduleCalendar";

export default function SchedulePage() {
    return (
        <main className="bg-gray-50/50 min-h-screen py-16 md:py-24">
            <div className="container px-4 flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <UserSidebar />

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Activity Timeline with Toggle */}
                    <ScheduleTimeline />

                    {/* Schedule Calendar Grid */}
                    <ScheduleCalendar />
                </div>
            </div>
        </main>
    );
}
