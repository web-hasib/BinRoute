import Image from "next/image";
import Link from "next/link";

const drivers = [
  {
    name: "Tomas Diko",
    username: "@TomasDiko",
    status: "En Route",
    statusColor: "text-orange-600 bg-orange-50",
    avatar: "https://ui-avatars.com/api/?name=Tomas+Diko&background=random",
  },
  {
    name: "Tomas Diko",
    username: "@TomasDiko",
    status: "Online",
    statusColor: "text-green-600 bg-green-50",
    avatar: "https://ui-avatars.com/api/?name=Tomas+Diko&background=random",
  },
  {
    name: "Tomas Diko",
    username: "@TomasDiko",
    status: "Offline",
    statusColor: "text-gray-500 bg-gray-50",
    avatar: "https://ui-avatars.com/api/?name=Tomas+Diko&background=random",
  },
];

export const DriverStatus = () => {
  return (
    <div className="bg-white p-6 rounded-none border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A]">Driver Status</h3>
        <Link href="/drivers" className="text-sm font-medium text-blue-600 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {drivers.map((driver, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-none overflow-hidden">
                <Image 
                  src={driver.avatar} 
                  alt={driver.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A1A1A]">{driver.name}</p>
                <p className="text-xs text-[#999999]">{driver.username}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-none ${driver.statusColor}`}>
              {driver.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
