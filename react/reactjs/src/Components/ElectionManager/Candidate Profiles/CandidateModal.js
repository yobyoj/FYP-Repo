import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import './CandidateModal.css';

function CandidateModal({ isOpen, onClose, onSave }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const uuid = uuidv4(); // Generate a UUID for the candidate
        onSave({ name, email, role, description, uuid }); // Include the UUID in the candidate object
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="candidate-modal-backdrop">
            <div className="candidate-modal">
                <div className="candidate-modal-header">
                    <h2>Add Candidate</h2>
                    <button onClick={onClose} className="candidate-close-button">x</button>
                </div>
                <form onSubmit={handleSubmit} className="candidate-modal-form">
                    <label>
                        Candidate Email:
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Candidate Name:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </label>
                    <label>
                        Candidate Role:
                        <input type="text" value={role} onChange={e => setRole(e.target.value)} required />
                    </label>
                    <label>
                        Description:
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                    </label>
                    <button type="submit" className="candidate-submit-button">Add Candidate</button>
                </form>
            </div>
        </div>
    );
}

export default CandidateModal;
