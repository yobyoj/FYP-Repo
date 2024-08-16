import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify'; 
import './TopicsModal.css';

function TopicsModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');


    const sanitizeInput = (input) => {
        const trimmedInput = input.trim(); 
        const sanitizedInput = DOMPurify.sanitize(trimmedInput); // Sanitize HTML input
        return sanitizedInput;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Sanitize the inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedDescription = sanitizeInput(description);
        const uuid = uuidv4(); // Generate a UUID for the topic
        

        onSave({ name: sanitizedName, description: sanitizedDescription, uuid });
        
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="topic-modal-backdrop">
            <div className="topic-modal">
                <div className="topic-modal-header">
                    <h2>Add Topic</h2>
                    <button onClick={onClose} className="topic-close-button">x</button>
                </div>
                <form onSubmit={handleSubmit} className="topic-modal-form">
                    <label>
                        Topic Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </label>
                    <label>
                        Description:
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                    </label>
                    <button type="submit" className="topic-submit-button">Add Topic</button>
                </form>
            </div>
        </div>
    );
}

export default TopicsModal;
