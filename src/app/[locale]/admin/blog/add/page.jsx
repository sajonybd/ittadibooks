"use client"
import Editor from '@/app/components/blog/Editor';
import ShowContent from '@/app/components/blog/showContent';
import RichTextEditor from '@/app/components/TextEditor';
import React, { useState } from 'react';

const Page = () => {
     const [post, setPost] = useState("");
      const [saving, setSaving] = useState(false);
     const showModal=()=>{
        document.getElementById('my_modal_1').showModal()
     }
  const [title, setTitle] = useState("");
  const showContent = (content) => {
    setPost(content);
  
  };
    return (
        <div>
            <Editor title={title} setTitle={setTitle} showContent={showContent} showModal={showModal} setSaving={setSaving} saving={saving}/>
            <ShowContent content={post}/>
           
        </div>
    );
}

export default Page;
