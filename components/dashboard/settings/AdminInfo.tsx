"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, User, Phone, Mail, MapPin, Edit, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation, useGetMeQuery, useUpdateGeneralProfileMutation } from "@/redux/api/auth/authApi";
import { toast } from "sonner";

const AdminInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Form States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Personal Info States (for editing)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    
    // Image States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { data: userData, isLoading: isUserLoading } = useGetMeQuery(undefined);
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateGeneralProfileMutation();

    useEffect(() => {
        if (userData?.data) {
            setName(userData.data.fullName || userData.data.name || "");
            setPhone(userData.data.phone || "");
            setAddress(userData.data.address || userData.data.location || "");
        }
    }, [userData]);

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            await changePassword({ oldPassword, newPassword }).unwrap();
            toast.success("Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to change password");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async () => {
        const formData = new FormData();
        const profileData = {
            fullName: name,
            phone: phone,
            address: address
        };
        formData.append("data", JSON.stringify(profileData));
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully");
            setIsEditing(false);
            // Optionally refetch user data here if tags are not enough
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#0265AF]" />
            </div>
        );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white border border-gray-100 overflow-hidden shadow-sm rounded-none">
          {/* Header Cover */}
          <div className="relative h-48 w-full bg-linear-to-r from-gray-200 to-gray-300">
            <Image 
              src="/dummy.png"
              alt="Profile Cover"
              fill
              className="object-cover opacity-50"
            />
          </div>

          {/* Profile Basic Info */}
          <div className="px-8 pb-10 relative">
            <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md">
                <Image 
                  src={imagePreview || userData?.data?.image || userData?.data?.profileImage || "/driver_profile_avatar_1775316560340.png"}
                  alt={userData?.data?.fullName || userData?.data?.name || "Admin"}
                  fill
                  className="object-cover"
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 p-2 bg-[#0265AF] text-white rounded-full border-2 border-white hover:bg-[#0265AF]/90 transition-colors shadow-lg"
                >
                    <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-10 space-y-10 border-t border-gray-100">
            <h3 className="text-xl font-bold text-[#172C41]">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    value={isEditing ? name : userData?.data?.fullName || userData?.data?.name || ""}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Write down your name"
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    value={isEditing ? phone : userData?.data?.phone || ""}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Write down your phone number"
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="email"
                    value={userData?.data?.email || ""}
                    readOnly
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type="text"
                    value={isEditing ? address : userData?.data?.address || userData?.data?.location || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Write down your address"
                    className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF] placeholder:text-gray-300"
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                {!isEditing ? (
                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white flex items-center gap-2 h-auto py-3.5 rounded-none"
                    >
                        <Edit className="w-4 h-4" /> Edit Personal Information
                    </Button>
                ) : (
                    <>
                        <Button 
                            onClick={() => {
                                setIsEditing(false);
                                setImageFile(null);
                                setImagePreview(null);
                            }}
                            variant="outline"
                            className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleProfileSubmit}
                            disabled={isUpdatingProfile}
                            className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white h-auto py-3.5 rounded-none min-w-[140px]"
                        >
                            {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                        </Button>
                    </>
                )}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white p-10 border border-gray-100 shadow-sm space-y-10 rounded-none">
          <h3 className="text-xl font-bold text-[#172C41]">Change Password</h3>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Old Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    required
                    className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[15px] font-bold text-[#172C41]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 font-light" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full pl-14 pr-12 py-4 bg-[#F8FAFC] border-none text-sm text-[#172C41] font-medium rounded-none min-h-[56px] focus:ring-1 focus:ring-[#0265AF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button 
                  type="button"
                  onClick={() => {
                      setOldPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                  }}
                  variant="outline"
                  className="px-10 border-[#0265AF] text-[#0265AF] hover:bg-blue-50 h-auto py-3.5 rounded-none font-bold"
                >
                    Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#0265AF] hover:bg-[#0265AF]/90 text-white h-auto py-3.5 rounded-none min-w-[160px]"
                >
                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save New Password"}
                </Button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default AdminInfo;
