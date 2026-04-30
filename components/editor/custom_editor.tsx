"use client";

import React, { useEffect, useRef } from "react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Link,
  List,
  TodoList,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Table,
  TableToolbar,
  Underline,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableLayout,
  TableProperties,
  ListProperties,
  Highlight,
  Autoformat,
  Alignment,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  title?: string;
  onDataChange?: (data: string) => void;
}

const CustomEditor = ({ title = "", onDataChange }: CustomEditorProps) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<ClassicEditor | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      console.log("Clicked on element:", e.target);
      if (e.target instanceof HTMLElement) {
        console.log("Element classes:", e.target.className);
        console.log("Element z-index:", window.getComputedStyle(e.target).zIndex);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    let isMounted = true;

    const initEditor = async () => {
      try {
        const editor = await ClassicEditor.create(editorContainerRef.current!, {
          licenseKey: "GPL",
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Strikethrough,
            Underline,
            Subscript,
            Superscript,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Link,
            List,
            ListProperties,
            TodoList,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableLayout,
            TableProperties,
            TableToolbar,
            Highlight,
            Autoformat,
            Alignment,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "heading",
              "|",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "highlight",
              "|",
              "bold",
              "italic",
              "strikethrough",
              "underline",
              "subscript",
              "superscript",
              "|",
              "link",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "|",
              "insertTable",
              "|",
              "alignment",
            ],
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
            ]
          },
          initialData: title || "",
          placeholder: "Start typing here...",
        });

        if (!isMounted) {
          editor.destroy();
          return;
        }

        editorInstanceRef.current = editor;

        // Force enable
        editor.enableReadOnlyMode('lock');
        editor.disableReadOnlyMode('lock');

        editor.model.document.on('change:data', () => {
          if (onDataChange) {
            onDataChange(editor.getData());
          }
        });

        // Focus the editor after a short delay
        setTimeout(() => {
          if (isMounted) {
             console.log("Attempting to focus editor...");
             editor.editing.view.focus();
             console.log("Editor focus attempted. Is ReadOnly?", editor.isReadOnly);
          }
        }, 1000);

      } catch (error) {
        console.error("CKEditor Initialization Error:", error);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().then(() => {
          editorInstanceRef.current = null;
        });
      }
    };
  }, []);

  const handleManualUnlock = () => {
    if (editorInstanceRef.current) {
      console.log("Manual Unlock Attempted");
      editorInstanceRef.current.enableReadOnlyMode('lock');
      editorInstanceRef.current.disableReadOnlyMode('lock');
      editorInstanceRef.current.editing.view.focus();
      alert("Manual Unlock Attempted. Check if you can type now.");
    } else {
      alert("Editor instance not found!");
    }
  };

  return (
    <div 
      className="ck-editor-container" 
      style={{ 
        position: 'relative', 
        zIndex: 100, 
        pointerEvents: 'auto',
        minHeight: '400px',
        border: '2px solid transparent'
      }}
    >
      <div className="absolute top-[-40px] right-0 flex gap-2">
        <button 
          onClick={handleManualUnlock}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors z-[110]"
        >
          Diagnostic: Manual Unlock
        </button>
      </div>
      <style>{`
        .ck-editor-container .ck-editor__editable {
          min-height: 400px;
          border-radius: 0 !important;
          background-color: white !important;
          cursor: text !important;
          pointer-events: auto !important;
        }
        .ck-editor-container .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: #0061AA !important;
          box-shadow: none !important;
        }
        .ck-body {
          z-index: 9999 !important;
        }
        .ck-body-wrapper {
          z-index: 10002 !important;
        }
        .ck.ck-dropdown__panel {
          z-index: 10001 !important;
        }
        .ck.ck-toolbar {
          border-radius: 0 !important;
          pointer-events: auto !important;
        }
        .ck.ck-editor__top {
           pointer-events: auto !important;
        }
        .ck-content {
           font-family: inherit;
           line-height: 1.6;
           color: black !important;
           opacity: 1 !important;
        }
      `}</style>
      <div ref={editorContainerRef} />
    </div>
  );
};

export default CustomEditor;
