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
             editor.editing.view.focus();
          }
        }, 500);

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

  return (
    <div 
      className="ck-editor-container" 
      style={{ 
        position: 'relative', 
        zIndex: 50, 
        pointerEvents: 'auto',
        minHeight: '400px'
      }}
    >
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
