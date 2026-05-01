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
  Underline,
  Subscript,
  Superscript,
  Link,
  List,
  ListProperties,
  TodoList,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Table,
  TableToolbar,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  Highlight,
  Autoformat,
  Alignment,
  BlockQuote,
  Indent,
  IndentBlock,
  MediaEmbed,
  HorizontalLine,
  Base64UploadAdapter,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  LinkImage,
  GeneralHtmlSupport,
  SourceEditing,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  initialData?: string;
  onDataChange?: (data: string) => void;
}

function CustomEditor({ initialData = "", onDataChange }: CustomEditorProps) {
  return (
    <div className="ck-editor-wrapper relative w-full border border-gray-200">
      <style>{`
        /* Root variable overrides for a premium feel */
        :root {
          --ck-color-base-border: #e2e8f0;
          --ck-color-toolbar-background: #ffffff;
          --ck-border-radius: 0px;
          --ck-color-focus-border: #0061AA;
          --ck-inner-shadow: none;
        }

        .ck-editor__editable {
          min-height: 450px;
          padding: 1.5rem 2rem !important;
          font-size: 16px;
          line-height: 1.6;
          color: #1a202c;
          border: none !important;
        }

        .ck.ck-editor__main > .ck-editor__editable:focus {
          border-color: transparent !important;
          box-shadow: none !important;
        }

        .ck.ck-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc !important;
          padding: 0.5rem !important;
        }

        /* Content styling for preview accuracy */
        .ck-content h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; color: #0f172a; }
        .ck-content h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; }
        .ck-content h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #334155; }
        .ck-content p { margin-bottom: 1.25rem; }
        
        .ck-content ul { list-style-type: disc !important; padding-left: 2rem !important; margin-bottom: 1.25rem !important; }
        .ck-content ol { list-style-type: decimal !important; padding-left: 2rem !important; margin-bottom: 1.25rem !important; }
        .ck-content li { margin-bottom: 0.5rem; }
        
        .ck-content blockquote {
          border-left: 4px solid #0061AA;
          padding-left: 1.5rem;
          font-style: italic;
          color: #475569;
          margin: 1.5rem 0;
        }

        .ck-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1rem 0;
        }

        /* Z-index fixes for modals */
        .ck-body-wrapper { z-index: 10002 !important; }
        .ck.ck-balloon-panel { z-index: 10005 !important; }
      `}</style>

      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",
          plugins: [
            Essentials, Paragraph, Heading, Bold, Italic, Strikethrough, Underline,
            Subscript, Superscript, FontSize, FontColor, FontBackgroundColor,
            Link, List, ListProperties, TodoList, Table, TableCaption,
            TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
            Highlight, Autoformat, Alignment, BlockQuote, Indent, IndentBlock,
            MediaEmbed, HorizontalLine, Base64UploadAdapter, Image, ImageToolbar,
            ImageCaption, ImageStyle, ImageResize, LinkImage, GeneralHtmlSupport,
            SourceEditing,
          ],
          toolbar: {
            items: [
              "sourceEditing", "|",
              "undo", "redo", "|",
              "heading", "|",
              "fontSize", "fontColor", "fontBackgroundColor", "|",
              "bold", "italic", "underline", "strikethrough", "|",
              "alignment", "|",
              "numberedList", "bulletedList", "todoList", "|",
              "outdent", "indent", "|",
              "link", "insertTable", "imageUpload", "mediaEmbed", "|",
              "blockQuote", "horizontalLine", "highlight",
            ],
            shouldNotGroupWhenFull: true
          },
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
              }
            ]
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          },
          fontSize: {
            options: [9, 11, 13, "default", 17, 19, 21, 24, 28, 32],
          },
          image: {
            toolbar: [
              'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|',
              'toggleImageCaption', 'imageTextAlternative', '|',
              'linkImage'
            ]
          },
          table: {
            contentToolbar: [
              "tableColumn", "tableRow", "mergeTableCells",
              "tableCellProperties", "tableProperties",
            ],
          },
          initialData: initialData || "<p></p>",
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
