"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./custom_editor"), {
  ssr: false,
  loading: () => <p className="p-4 text-gray-500 italic">Loading editor...</p>,
});

interface EditorClientProps {
  title?: string;
  onDataChange?: (data: string) => void;
}

export default function EditorClient({ title = "My Editor", onDataChange }: EditorClientProps) {
  return <Editor title={title} onDataChange={onDataChange} />;
}
