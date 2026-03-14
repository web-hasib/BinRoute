"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      description="Update your personal and account information."
      className="max-w-4xl"
    >
      <div className="space-y-8 py-4">
        {/* Basic Information */}
        <section className="bg-white border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-[#172C41] mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">First Name</label>
              <input
                type="text"
                defaultValue="Tomas"
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Last Name</label>
              <input
                type="text"
                defaultValue="Diko"
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Email Address</label>
              <input
                type="email"
                defaultValue="tomasdiko@gmail.com"
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Phone Number</label>
              <input
                type="text"
                defaultValue="+880 1XXXXXXXXX"
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
                placeholder="Enter your business name..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#172C41]">Business Type</label>
              <input
                type="text"
                placeholder="Enter your business type..."
                className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="bg-white border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-[#172C41] mb-6">Address Information</h3>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#172C41]">Full Address</label>
            <input
              type="text"
              placeholder="Enter your name..."
              className="w-full p-4 bg-gray-50 border-none outline-none text-gray-800 placeholder:text-gray-400 focus:bg-gray-100 transition-colors"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#172C41] py-8 rounded-none font-bold text-lg"
          >
            Reset Changes
          </Button>
          <Button 
            onClick={onSave}
            className="flex-1 bg-[#0061AA] hover:bg-[#004e89] text-white py-8 rounded-none font-bold text-lg"
          >
            Save Change
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
