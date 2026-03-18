"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { 
  Search, 
  Plus, 
  ArrowLeft, 
  Pencil 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/ui/CustomPagination";
import EditorClient from "@/components/editor/EditorClient";

// Mock Data
const initialTermsConditions = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  content: "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress. As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
}));

type View = "list" | "add" | "edit";

const TermsConditionPage = () => {
  const [view, setView] = useState<View>("list");
  const [terms, setTerms] = useState(initialTermsConditions);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTerm, setEditingTerm] = useState<(typeof initialTermsConditions)[0] | null>(null);
  const [editorContent, setEditorContent] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTerms = terms.filter(term => 
    term.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTerms.length / rowsPerPage);
  
  const handleAddTerm = () => {
    const id = (terms.length + 1).toString();
    setTerms([...terms, { id, content: editorContent }]);
    setView("list");
  };

  const handleUpdateTerm = () => {
    if (!editingTerm) return;
    setTerms(terms.map(t => t.id === editingTerm.id ? { ...t, content: editorContent } : t));
    setView("list");
  };

  if (view === "add" || view === "edit") {
    return (
      <Container>
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setView("list")}
            className="p-1 hover:bg-gray-200 transition-colors rounded-none"
          >
            <ArrowLeft className="size-6 text-[#1A1A1A]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            {view === "add" ? "Add New Terms & Condition" : "Edit Terms & Condition"}
          </h1>
        </div>

        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-[#0A2540] mb-4">
                Write Down New Privacy Policy
              </label>
              <div className="border border-gray-200 shadow-sm">
                <EditorClient 
                  title={editorContent || "Write down the privacy policy....."}
                  onDataChange={(val) => setEditorContent(val)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button"
                onClick={() => setView("list")}
                variant="outline"
                className="border-[#0061AA] text-[#0061AA] hover:bg-[#0061AA]/5 px-10 h-11 text-sm font-bold rounded-none transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={view === "add" ? handleAddTerm : handleUpdateTerm}
                className="bg-[#0061AA] hover:bg-[#004275] text-white px-8 h-11 text-sm font-bold rounded-none border-none transition-colors"
              >
                {view === "add" ? "Add This Privacy Policy" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold text-[#0A2540] mb-6 font-primary">Terms & Condition</h1>
      
      <div className="bg-white p-4 shadow-sm mb-0 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8F9FB] border border-gray-200 focus:outline-none focus:border-[#0061AA] transition-all text-sm h-11"
            />
          </div>
          <Button 
            onClick={() => {
              setEditorContent("");
              setView("add");
            }}
            className="bg-[#0061AA] hover:bg-[#004275] text-white px-6 py-2 h-11 font-bold flex items-center gap-2 rounded-none transition-colors border-none"
          >
            <Plus className="size-4" /> Add New Services Area
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 mb-8 divide-y divide-gray-100">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term, index) => (
            <div key={term.id} className="p-6 flex items-start justify-between gap-4 hover:bg-gray-50/20 transition-colors group">
              <div className="flex gap-3">
                <span className="text-[#1A1A1A] font-medium shrink-0">{index + 1}.</span>
                <p className="text-[#1A1A1A]/80 max-w-5xl text-base leading-relaxed">
                  {term.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingTerm(term);
                  setEditorContent(term.content);
                  setView("edit");
                }}
                className="p-1.5 text-[#0061AA] hover:bg-blue-50 transition-all rounded-none border border-transparent hover:border-blue-100"
              >
                <Pencil className="size-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            No terms found matching your search.
          </div>
        )}
        
        <div className="bg-white">
          <CustomPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            className="border-t border-gray-100"
          />
        </div>
      </div>
    </Container>
  );
};

export default TermsConditionPage;