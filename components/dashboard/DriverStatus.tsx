import Image from "next/image";
import Link from "next/link";
import { UserCircle } from "lucide-react";

interface Driver {
  id: string;
  fullName: string;
  image: string | null;
  driverStatus: string | null;
}

interface DriverStatusProps {
  data: {
    drivers: Driver[];
    summary: {
      online: number;
      offline: number;
      inRoute: number;
      total: number;
    };
  };
}

export const DriverStatus = ({ data }: DriverStatusProps) => {
  const drivers = data?.drivers || [];

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case "ONLINE":
        return { text: "Online", color: "text-green-600 bg-green-50" };
      case "OFFLINE":
        return { text: "Offline", color: "text-gray-500 bg-gray-50" };
      case "IN_ROUTE":
      case "EN_ROUTE":
        return { text: "En Route", color: "text-orange-600 bg-orange-50" };
      default:
        return { text: "Offline", color: "text-gray-500 bg-gray-50" };
    }
  };

  return (
    <div className="bg-white p-6 rounded-none border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Driver Status</h3>
        <Link href="/dashboard/drivers" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {drivers.slice(0, 3).map((driver, index) => {
          const statusInfo = getStatusInfo(driver.driverStatus);

          return (
            <div key={driver.id || index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-none overflow-hidden bg-gray-100 flex items-center justify-center">
                  {driver.image ? (
                    <Image
                      src={driver.image}
                      alt={driver.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <UserCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{driver.fullName}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-none ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          );
        })}
        {drivers.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            No drivers found
          </div>
        )}
      </div>
    </div>
  );
};
