"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./custom_editor"), {
  ssr: false,
  loading: () => <p className="p-4 text-gray-500 italic">Loading editor...</p>,
});

interface EditorClientProps {
  initialData?: string;
  onDataChange?: (data: string) => void;
}

export default function EditorClient({ initialData = "", onDataChange }: EditorClientProps) {
  return <Editor initialData={initialData} onDataChange={onDataChange} />;
}
