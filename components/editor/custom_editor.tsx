"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
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

function CustomEditor({ title = "", onDataChange }: CustomEditorProps) {
  return (
    <div className="ck-editor-wrapper relative">
      <style>{`
        .ck-editor__editable {
          min-height: 300px;
          border-radius: 0 !important;
          background-color: white !important;
          color: black !important;
        }
        .ck-editor-wrapper .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: #0061AA !important;
          box-shadow: none !important;
          background-color: white !important;
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
             background-color: #f8f9fa !important;
        }
        /* Fix for dimmed/disabled look in some production builds */
        .ck.ck-editor__editable.ck-read-only {
          background-color: #f4f4f4 !important;
        }
        .ck.ck-reset_all, .ck.ck-reset_all * {
          opacity: 1 !important;
        }
      `}</style>
      <CKEditor
        key="main-ckeditor"
        editor={ClassicEditor}
        config={{
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
          placeholder: "Start typing here...",
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
            ]
          },
          fontSize: {
            options: [9, 11, 13, "default", 17, 19, 21, 24, 28, 32],
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "tableCellProperties",
              "tableProperties",
            ],
          },
        }}
        data={title || ""}
        onReady={(editor) => {
          console.log("CKEditor Ready");
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onDataChange) {
            onDataChange(data);
          }
        }}
        onError={(error) => {
          console.error("CKEditor Error:", error);
        }}
      />
    </div>
  );
}

export default CustomEditor;
