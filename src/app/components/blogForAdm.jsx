 

"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Code from "@tiptap/extension-code";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { all, createLowlight } from "lowlight";
import toast from "react-hot-toast";

const lowlight = createLowlight(all);

export default function BlogEditorPage() {
  const [title, setTitle] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      Image,
      ListItem,
      OrderedList,
      BulletList,
      Blockquote,
      Code,
      HorizontalRule,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: "",
  });

  if (!editor) return <div className="p-10 text-center">Loading editor...</div>;

  // Toolbar actions
  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const buttons = [
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold") },
    { label: "I", action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic") },
    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive("heading", { level: 1 }) },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }) },
    { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList") },
    { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList") },
    { label: "❝", action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive("blockquote") },
    { label: "</>", action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive("codeBlock") },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Title */}
      <input
        type="text"
        placeholder="Enter blog title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-2"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border border-gray-200 bg-gray-50 p-2 rounded-md">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={`px-3 py-1 rounded text-sm font-medium ${
              btn.isActive
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {btn.label}
          </button>
        ))}

        <button
          onClick={setLink}
          className={`px-3 py-1 rounded text-sm font-medium ${
            editor.isActive("link")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-100"
          }`}
        >
          🔗 Link
        </button>

        <button
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 hover:bg-gray-100"
        >
          🖼 Image
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 hover:bg-gray-100"
        >
          ―
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            ⎌ Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            ↻ Redo
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-md p-4 min-h-[400px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const html = editor.getHTML();
            toast.success("Blog content saved successfully!");
             
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Save Blog
        </button>
      </div>
    </div>
  );
}
