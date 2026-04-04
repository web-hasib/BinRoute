"use client";

import React, { useState } from "react";
import Container from "@/components/ui/container";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomPagination } from "@/components/ui/CustomPagination";

// Mock Data
const initialFaqs = [
  {
    id: "1",
    question: "How long can I keep the dumpster?",
    answer: "As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress.",
  },
  {
    id: "2",
    question: "What dumpster sizes do you offer?",
    answer: "We offer various sizes including 10, 20, and 30-yard dumpsters to fit your project needs.",
  },
  {
    id: "3",
    question: "How do I book a dumpster?",
    answer: "You can book through our website or call our customer service team directly.",
  },
  {
    id: "4",
    question: "How fast can you deliver?",
    answer: "We typically offer same-day or next-day delivery depending on your location.",
  },
  {
    id: "5",
    question: "Where do you place the dumpster?",
    answer: "We place it on a flat, hard surface as specified by you, ensuring no damage to your property.",
  },
  {
    id: "6",
    question: "Do I need to be home for delivery?",
    answer: "No, as long as the delivery area is accessible and marked if necessary.",
  },
  {
    id: "7",
    question: "What can I put in the dumpster?",
    answer: "Most household and construction debris. Prohibited items include hazardous waste and liquids.",
  },
];

type View = "list" | "add" | "edit";

const FAQPage = () => {
  const [view, setView] = useState<View>("list");
  const [faqs, setFaqs] = useState(initialFaqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFaq, setEditingFaq] = useState<(typeof initialFaqs)[0] | null>(null);
  const [openIndex, setOpenIndex] = useState<string | null>(initialFaqs[0].id);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);
  
  const handleAddFaq = (newFaq: { question: string, answer: string }) => {
    const id = (faqs.length + 1).toString();
    setFaqs([{ id, ...newFaq }, ...faqs]);
    setView("list");
  };

  const handleUpdateFaq = (updatedFaq: (typeof initialFaqs)[0]) => {
    setFaqs(faqs.map(f => f.id === updatedFaq.id ? updatedFaq : f));
    setView("list");
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  if (view === "add" || view === "edit") {
    return (
      <Container >
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView("list")}
            className="p-1 hover:bg-gray-200 transition-colors rounded-none"
          >
            <ArrowLeft className="size-6 text-[#1A1A1A]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            {view === "add" ? "Add New FAQ" : "Edit FAQ"}
          </h1>
        </div>

        <FAQForm 
          type={view} 
          initialData={editingFaq}
          onSubmit={view === "add" ? handleAddFaq : handleUpdateFaq}
          onCancel={() => setView("list")}
        />
      </Container>
    );
  }

  return (
    <Container >
      <h1 className="text-2xl font-bold text-[#0A2540] mb-6 font-primary">FAQ List</h1>
      
      <div className="bg-white p-5 shadow-sm mb-0 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:outline-none focus:border-[#0061AA] transition-all text-sm h-11"
            />
          </div>
          <Button 
            onClick={() => setView("add")}
           variant="primary"
          >
            <Plus className="size-4" /> Add New FAQ
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm  mb-8">
        <div className="divide-y divide-gray-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="transition-all duration-300">
                <button 
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-6 text-left hover:bg-gray-50/30 transition-colors group"
                >
                  <span className={cn(
                    "text-lg font-bold transition-colors",
                    openIndex === faq.id ? "text-[#0061AA]" : "text-[#1A1A1A]"
                  )}>
                    {faq.question}
                  </span>
                  {openIndex === faq.id ? (
                    <ChevronUp className="size-6 text-[#1A1A1A]" />
                  ) : (
                    <ChevronDown className="size-6 text-[#1A1A1A]/50 group-hover:text-[#1A1A1A]" />
                  )}
                </button>
                
                {openIndex === faq.id && (
                  <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[#666666] leading-relaxed mb-8 max-w-4xl text-base">
                      {faq.answer}
                    </p>
                    <div className="flex items-center justify-end gap-3">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFaq(faq);
                          setView("edit");
                        }}
                        variant="outline"
                        className="border-[#0061AA] bg-blue-50 text-[#0061AA] hover:bg-[#2070c7] hover:text-white px-5 h-10 text-sm font-bold flex items-center gap-2 rounded-none transition-all group/edit"
                      >
                           <Pencil className="size-3" />
                       
                        Edit FAQ
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFaq(faq.id);
                        }}
                        variant="outline"
                        className="border-[#FF4D4F] bg-red-50 text-[#FF4D4F] hover:bg-[#ed5d60] hover:text-white px-5 h-10 text-sm font-bold flex items-center gap-2 rounded-none transition-all group/delete"
                      >
                          <Trash2 className="size-3" />
                        Delete FAQ
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              No FAQs found matching your search.
            </div>
          )}
        </div>

        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          className="border-t border-gray-100"
        />
      </div>
    </Container>
  );
};

const FAQForm = ({ 
  type, 
  initialData, 
  onSubmit, 
  onCancel 
}: { 
  type: "add" | "edit", 
  initialData?: (typeof initialFaqs)[0] | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (faq: any) => void,
  onCancel: () => void
}) => {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "edit" && initialData) {
      onSubmit({ ...initialData, question, answer });
    } else {
      onSubmit({ question, answer });
    }
  };

  return (
    <div className="bg-white p-8 md:p-12  shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-bold text-[#0A2540] mb-4">
            {type === "add" ? "FAQ Question" : "Edit FAQ Question"}
          </label>
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="How long can I keep the dumpster?"
            className="w-full px-5 py-4 bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none transition-all text-[#1A1A1A] h-14"
            required
          />
        </div>
        
        <div>
          <label className="block text-lg font-bold text-[#0A2540] mb-4">
            {type === "add" ? "Answer" : "Edit Answer"}
          </label>
          <textarea 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="As your needs increase, our solutions expand with you—without disrupting your workflow or adding operational stress."
            rows={6}
            className="w-full px-5 py-4 bg-[#F8F9FB] border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none transition-all text-[#1A1A1A] resize-none min-h-[180px]"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-[#0061AA] text-[#0061AA] hover:bg-[#0061AA]/5 px-10 h-12 text-base font-bold rounded-none transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-[#0061AA] hover:bg-[#004275] text-white px-10 h-12 text-base font-bold rounded-none border-none transition-colors"
          >
            {type === "add" ? "Add This FAQ" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FAQPage;