import { EditorContent } from '@tiptap/react';
import React from 'react';

const EditorContentMain = ({editor}) => {
    return (
        <div>
             <EditorContent editor={editor} className='editor'/>
        </div>
    );
}

export default EditorContentMain;
