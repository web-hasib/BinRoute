"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/ui/container";
import { 
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorClient from "@/components/editor/EditorClient";
import { 
  useGetAllTermsQuery, 
  useCreateTermsMutation 
} from "@/redux/api/terms-privacy/termsPricacyApi";
import { toast } from "sonner";

const TermsConditionPage = () => {
  const { data: termsData, isLoading: isFetching } = useGetAllTermsQuery();
  const [createTerms, { isLoading: isUpdating }] = useCreateTermsMutation();
  const [editorContent, setEditorContent] = useState("");

  useEffect(() => {
    if (termsData?.data?.content) {
      setEditorContent(termsData.data.content);
    }
  }, [termsData]);

  const handleSave = async () => {
    try {
      await createTerms({ content: editorContent }).unwrap();
      toast.success("Terms & Conditions updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Terms & Conditions");
    }
  };

  if (isFetching) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="size-8 animate-spin text-[#0061AA]" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#0A2540] font-primary">Terms & Conditions</h1>
        <Button 
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-[#0061AA] hover:bg-[#004275] text-white px-8 h-11 text-sm font-bold rounded-none border-none transition-colors flex items-center gap-2"
        >
          {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Changes
        </Button>
      </div>

      <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-[#0A2540] mb-4">
              Update Terms & Conditions Content
            </label>
            <div className="border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
              <EditorClient 
                key={termsData?.data?.content}
                initialData={termsData?.data?.content || ""}
                onDataChange={(val) => setEditorContent(val)}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TermsConditionPage;