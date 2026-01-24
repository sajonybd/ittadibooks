
"use client";
import React, { useCallback, useState } from 'react';
import "../blog/editor.css";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import axios from 'axios';
import EditorContentMain from './EditorContentMain';
import CustomImage from './CustomImage';

const extensions = [
    StarterKit,
    Underline,
     CustomImage.configure({ inline: false, allowBase64: true }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
    }),
];

const content = ``;

const Editor = ({ showContent, showModal, saving, setSaving, title, setTitle }) => {
    const [localImages, setLocalImages] = useState([]);
    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content,
    });

    

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


    const buttonClasses = (active) =>
        `px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${active ? 'bg-gray-200' : ''}`;

    const handleShowContent = () => {
        const htmlContent = editor.getHTML();
        showContent(htmlContent);
        showModal();
    };

    
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

    // STEP 1: Show instantly using local blob URL
    const localUrl = URL.createObjectURL(file);
    editor
      .chain()
      .focus()
      .setImage({
        src: localUrl,
        width: width + "px",
        height: height ? height + "px" : null,
      })
      .run();

    // STEP 2: Upload to backend in background
    try {
      const uploadedUrl = await uploadImageToBackend(file);

      // STEP 3: Replace local URL with real cloud URL after upload
      const html = editor.getHTML();
      const updatedHtml = html.replaceAll(localUrl, uploadedUrl);
      editor.commands.setContent(updatedHtml, false);

      setLocalImages((prev) => [...prev, { file, url: uploadedUrl }]);
    } catch (err) {
      // // console.error("Image upload failed:", err);
      alert("❌ Failed to upload image.");
    }
  };
}, [editor]);

    // Handle Save
    const handleSave = async () => {
        if (!editor) return;
        setSaving(true);

        try {
            let html = editor.getHTML();

            // 1️⃣ Upload all local images and replace in HTML
            for (const img of localImages) {
                const cloudUrl = await uploadImageToBackend(img.file);
                html = html.replaceAll(img.localUrl, cloudUrl);
            }

            // 2️⃣ Save final HTML to DB
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/blog/save`, { title, html });

            alert("✅ Blog saved successfully!");
            setLocalImages([]); // clear uploaded images
        } catch (err) {
            // // console.error(err);
            alert("❌ Failed to save blog.");
        } finally {
            setSaving(false);
        }
    };

    if (!editor) return null;
    return (
        <div className="w-full mt-10 max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
            <input
                type="text"
                placeholder="Enter blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-10 mt-5 text-3xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-2"
            />

            {/* Toolbar */}
            <div className="mb-3 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive('bold'))}>Bold</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive('italic'))}>Italic</button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClasses(editor.isActive('underline'))}>U</button>
                <button onClick={handleImageAdd} className={buttonClasses(false)}>Image</button>
                <button onClick={setLink} className={buttonClasses(editor.isActive('link'))}>Set link</button>
                <button onClick={() => editor.chain().focus().unsetLink().run()} className={buttonClasses(false)}>Unset link</button>
                <button onClick={() => editor.chain().focus().setParagraph().run()} className={buttonClasses(editor.isActive('paragraph'))}>Paragraph</button>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} className={buttonClasses(editor.isActive('heading', { level }))}>H{level}</button>
                ))}
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive('bulletList'))}>Bullet List</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive('orderedList'))}>Ordered List</button>
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClasses(editor.isActive('blockquote'))}>Blockquote</button>
                <button onClick={() => editor.chain().focus().undo().run()} className={buttonClasses(false)}>Undo</button>
                <button onClick={() => editor.chain().focus().redo().run()} className={buttonClasses(false)}>Redo</button>
            </div>

            {/* Editor content */}
            <div className="max-w-full rounded-md p-4 min-h-[300px]">
                <EditorContentMain editor={editor} />
            </div>

            <div className='mt-5 flex gap-3'>
                <button onClick={handleShowContent} className='bg-green-500 px-4 py-2 rounded-lg'>Show</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default Editor;
