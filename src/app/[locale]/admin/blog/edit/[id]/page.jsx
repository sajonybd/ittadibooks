"use client"
import ShowContent from '@/app/components/blog/showContent';
import BlogEditorEdit from '@/app/components/EditBlog/EditBlog';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
    const { id } = useParams()
    const [post, setPost] = useState("");
    const showModal = () => {
        document.getElementById('my_modal_1').showModal()
    }
    const [title, setTitle] = useState("");
    const showContent = (content) => {
        setPost(content);
       
    };
    return (
        <div>

            <BlogEditorEdit blogId={id} showContent={showContent} showModal={showModal}/>
            <ShowContent content={post}/>
        </div>
    );
}

export default Page;
