"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Phone, Mail, MapPin, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateDriverMutation, useGetDriverByIdQuery, useUpdateDriverMutation } from "@/redux/api/adminDashboard/driverApi";
import { toast } from "sonner";

interface DriverFormProps {
    mode: "add" | "edit";
    id?: string;
}

const DriverForm = ({ mode, id }: DriverFormProps) => {
    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // API Hooks
    const [createDriver, { isLoading: isCreating }] = useCreateDriverMutation();
    const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation();
    const { data: driverData, isLoading: isFetching } = useGetDriverByIdQuery(id || "", {
        skip: mode === "add" || !id
    });

    // Form States
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [password, setPassword] = useState("");

    // Populate form in edit mode
    useEffect(() => {
        if (mode === "edit" && driverData?.data) {
            const driver = driverData.data;
            setFullName(driver.fullName);
            setPhone(driver.phone);
            setEmail(driver.email);
            setAddress(driver.address);
        }
    }, [mode, driverData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mode === "add") {
            try {
                await createDriver({
                    fullName,
                    phone,
                    email,
                    address,
                    contactEmail,
                    password
                }).unwrap();
                setIsSubmitted(true);
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to add driver");
            }
        } else if (mode === "edit" && id) {
            try {
                await updateDriver({
                    id,
                    data: {
                        fullName,
                        phone,
                        email,
                        address
                    }
                }).unwrap();
                toast.success("Driver updated successfully");
                router.back();
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to update driver");
            }
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0265AF]" />
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-130px)]  flex flex-col items-center justify-center space-y-8 overflow-y-hidden">
                <div className="relative w-48 h-48">
                <Image 
                    src="/dummy.png"
                    alt="Success"
                    fill
                    className="object-contain"
                />
                </div>
                <div className="space-y-4 text-center">
                <h2 className="text-3xl font-extrabold text-[#172C41]">You Added {fullName} as a Driver</h2>
                <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                    You have successfully added a new driver. Now you can <br /> assign jobs to the new driver.
                </p>
                </div>
                <Button 
                    onClick={() => router.push("/dashboard/drivers")}
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-12 py-4 h-auto rounded-none text-lg mt-8"
                >
                Check Job Status
                </Button>
            </div>
        );
    }

    return (
      <div className="space-y-8 pb-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#172C41] font-bold text-xl mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          {mode === "add" ? "Add New Driver" : "Edit Driver Details"}
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          {/* Personal Information */}
          <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-8 rounded-none">
            <h3 className="text-lg font-bold text-[#172C41]">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tomas Diko" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 890" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@example.com" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#172C41]">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, Anytown" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Login Credential (Only for Add) */}
          {mode === "add" && (
            <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-8 rounded-none">
              <h3 className="text-lg font-bold text-[#172C41]">Login Credential</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#172C41]">Email For Login</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="driver.login@example.com" 
                      required
                      className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#172C41]">Password For Login</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password" 
                      required
                      className="w-full pl-12 pr-12 py-4 bg-[#F8FAFC] border-none focus:ring-1 focus:ring-[#0265AF] text-sm text-[#172C41] font-medium placeholder:text-gray-300 rounded-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-8 py-3 font-bold border-gray-200 text-gray-500 h-auto rounded-none"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={isCreating}
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-8 py-3 h-auto rounded-none min-w-[200px]"
                >
                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Driver Information and Send Credentials"}
                </Button>
              </div>
            </div>
          )}

          {/* Buttons for Edit */}
          {mode === "edit" && (
            <div className="flex justify-end gap-4">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => router.back()}
                    className="px-8 py-3 font-bold border-gray-200 text-[#0265AF] h-auto rounded-none"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={isUpdating}
                    className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white font-bold px-8 py-3 h-auto rounded-none min-w-[150px]"
                >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                </Button>
            </div>
          )}
        </form>
      </div>
    );
};

export default DriverForm;
