import UserSidebar from "@/components/sections/dashboard/UserSidebar";
import PaymentHistory from "@/components/sections/dashboard/PaymentHistory";

export default function PaymentHistoryPage() {
    return (
        <main className="bg-gray-50/50 min-h-screen py-16 md:py-24">
            <div className="container px-4 flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <UserSidebar />

                {/* Main Content */}
                <div className="flex-1">
                    <PaymentHistory />
                </div>
            </div>
        </main>
    );
}
