




"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import axios from "axios";
import EditorContentMain from "../blog/EditorContentMain";
import CustomImage from "../blog/CustomImage";
import "../blog/editor.css";
const extensions = [
  StarterKit,
  Underline,
  CustomImage.configure({ inline: false, allowBase64: true }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
  }),
];

const BlogEditorEdit = ({ blogId, showContent, showModal }) => {
  const [title, setTitle] = useState("");
  const [localImages, setLocalImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize TipTap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: "",
  });

  // Link handler — must always be declared before conditional returns
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Upload image
  const uploadImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/upload-image`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.url;
  };

  
  const handleImageAdd = useCallback(() => {
  if (!editor) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    // Ask for width/height
    const width = window.prompt("Enter image width in px (e.g. 400)", "400");
    const height = window.prompt("Enter image height in px (optional)", "");

    try {
      // Upload to server first
      const uploadedUrl = await uploadImageToBackend(file);

      // Insert uploaded image URL into editor
      editor.chain().focus().setImage({
        src: uploadedUrl,
        width: width + "px",
        height: height ? height + "px" : null,
      }).run();

      setLocalImages((prev) => [...prev, { file, url: uploadedUrl }]);
    } catch (err) {
      // // console.error("Image upload failed:", err);
      alert("❌ Failed to upload image.");
    }
  };
}, [editor]);

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/getBlog/${blogId}`);
        const blog = res.data;
        setTitle(blog.title || "");
        if (editor && blog.html) {
          editor.commands.setContent(blog.html);
        }
      } catch (err) {
        // // console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };

    if (editor) fetchBlog();
  }, [blogId, editor]);

  // Save updated blog
  const handleSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    try {
      let html = editor.getHTML();

      // Upload local images and replace URLs
      for (const img of localImages) {
        const cloudUrl = await uploadImageToBackend(img.file);
        html = html.replaceAll(img.localUrl, cloudUrl);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/edit`, { id: blogId, title, html });
      alert("✅ Blog updated successfully!");
      setLocalImages([]);
    } catch (err) {
      // // console.error(err);
      alert("❌ Failed to save blog.");
    } finally {
      setSaving(false);
    }
  }, [editor, blogId, title, localImages]);

  const buttonClasses = (active) =>
    `px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${active ? "bg-gray-200" : ""}`;


  const handleShowContent = () => {
    const htmlContent = editor.getHTML();
    showContent(htmlContent);
    showModal();
  };

  // Show loading after all hooks are called
  if (loading || !editor) return <p>Loading editor...</p>;

  return (
    <div className="w-full mt-2 max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <input
        type="text"
        placeholder="Enter blog title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-10 mt-5 text-3xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-2"
      />

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive("bold"))}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive("italic"))}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClasses(editor.isActive("underline"))}>U</button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={buttonClasses(false)}
        >
          Line Break
        </button>

        <button onClick={handleImageAdd} className={buttonClasses(false)}>Image</button>
        <button onClick={setLink} className={buttonClasses(editor.isActive("link"))}>Set link</button>
        <button onClick={() => editor.chain().focus().unsetLink().run()} className={buttonClasses(false)}>Unset link</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClasses(editor.isActive("paragraph"))}>Paragraph</button>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} className={buttonClasses(editor.isActive("heading", { level }))}>H{level}</button>
        ))}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive("bulletList"))}>Bullet List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive("orderedList"))}>Ordered List</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClasses(editor.isActive("blockquote"))}>Blockquote</button>
        <button onClick={() => editor.chain().focus().undo().run()} className={buttonClasses(false)}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className={buttonClasses(false)}>Redo</button>
      </div>

      {/* Editor */}
      <div className="max-w-full rounded-md p-4 min-h-[300px]">
        <EditorContentMain editor={editor} />
      </div>

      <div className="mt-5 flex gap-3">

        <button onClick={handleShowContent} className='bg-green-500 px-4 py-2 rounded-lg'>Show</button>

        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditorEdit;