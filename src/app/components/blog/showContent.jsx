import React from 'react';
import parse from 'html-react-parser';
const ShowContent = ({ content }) => {
    return (
        <div className='tiptap'>
            {/* Open the modal using document.getElementById('ID').showModal() method */}

            <dialog id="my_modal_1" className="modal ">
                <div className="modal-box max-w-5xl">
                    {parse(content)}
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>


        </div>
    );
}

export default ShowContent;
