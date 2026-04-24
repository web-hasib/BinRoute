import UserSidebar from "@/components/sections/dashboard/UserSidebar";
import ActiveServices from "@/components/sections/dashboard/ActiveServices";
import ActivityTimeline from "@/components/sections/dashboard/ActivityTimeline";
import PaymentHistory from "@/components/sections/dashboard/PaymentHistory";

export default function ProfilePage() {
    return (
        <main className="bg-gray-50/50 h-full">
            <div className="flex flex-col gap-8">
                {/* Welcome & Active Services */}
                <ActiveServices />

                {/* Activity Timeline */}
                <ActivityTimeline />

                {/* Payment History */}
                <PaymentHistory />
            </div>
        </main>
    );
}
