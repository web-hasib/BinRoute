import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen inter">
      <TopBar />
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
