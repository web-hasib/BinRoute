"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useGetMeQuery, useUpdateUserProfileMutation } from "@/redux/api/auth/authApi";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
  const { data: userResponse, isLoading: isFetching } = useGetMeQuery(undefined, { skip: !isOpen });
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  
  const user = userResponse?.data;
  const contactInfo = user?.contactInfo;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    businessName: "",
    wasteType: "",
    contactFullName: "",
    contactEmail: "",
    notes: ""
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        businessName: contactInfo?.businessName || "",
        wasteType: contactInfo?.wasteType || "",
        contactFullName: contactInfo?.fullName || user.fullName || "",
        contactEmail: contactInfo?.email || user.email || "",
        notes: contactInfo?.notes || ""
      });
      setPreviewUrl(user.image || null);
    }
  }, [user, contactInfo]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const dataPayload = {
        basicInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        businessContactInfo: {
          businessName: formData.businessName,
          wasteType: formData.wasteType,
          fullName: formData.contactFullName,
          email: formData.contactEmail,
          notes: formData.notes
        }
      };

      const submitData = new FormData();
      submitData.append("data", JSON.stringify(dataPayload));
      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      await updateUserProfile(submitData).unwrap();
      onSave(); // Close modal and potentially show success modal
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (isFetching) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" description="Loading profile data...">
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal and account information."
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-8 py-4">
        {/* Profile Image */}
        <section className="bg-white border border-gray-100 p-8">
           <h3 className="text-xl font-bold text-[#172C41] mb-6">Profile Picture</h3>
           <div className="flex items-center gap-6">
             <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                <Image src={previewUrl || "/dummy.png"} alt="Preview" fill className="object-cover" />
             </div>
             <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-[#0061AA] file:text-white hover:file:bg-[#004e89] transition-colors"/>
           </div>
        </section>

        {/* Basic Information */}
        <section className="bg-white border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-[#172C41] mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors cursor-not-allowed opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Full Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="bg-white border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-[#172C41] mb-6">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Business Type / Waste Type</label>
              <input
                type="text"
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                placeholder="Enter your business/waste type..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Contact Full Name</label>
              <input
                type="text"
                name="contactFullName"
                value={formData.contactFullName}
                onChange={handleChange}
                placeholder="Enter contact full name..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter contact email..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2 mt-6">
              <label className="text-sm font-bold text-[#172C41]">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any notes..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors resize-none"
                rows={3}
              />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#172C41] py-8 rounded-none font-bold text-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="flex-1 bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg"
          >
            {isUpdating ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            {isUpdating ? "Saving..." : "Save Change"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
