import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CandidateModal from "./CandidateModal";
import './CandidateProfiles.css';
import { useNavigate } from "react-router-dom";

function ElectionManagerCandidateProfiles({ formData, updateCandidates }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [candidates, setCandidates] = useState(formData.candidates);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleAddCandidate = (candidate) => {
        const emailExists = candidates.some(c => c.email === candidate.email);
        const emailAndNameExist = candidates.some(c => c.email === candidate.email && c.name === candidate.name);
    
        if (emailExists || emailAndNameExist) {
            alert('This candidate already exists.');
        } else {
            const updatedCandidates = [...candidates, candidate];
            setCandidates(updatedCandidates);
            updateCandidates(updatedCandidates);
            handleCloseModal();
        }
    };
    

    const handleRemoveCandidate = (candidateName) => {
        const updatedCandidates = candidates.filter(c => c.name !== candidateName);
        setCandidates(updatedCandidates); 
        updateCandidates(updatedCandidates);
    };

    const navigate = useNavigate();

    const handleNavigate = () => {
        if (candidates.length < 2) {
            alert("You have insufficient candidates. ");
        }
        else if (candidates.length > 2){
            alert("You have too many candidates. The maximum number of candidates is 2.")
        }
        else{
            navigate('/election-manager/list-of-voters');
        }
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className="candidate-profiles-page">
                <Sidebar electionType={formData.electionType}/>
                    <main className="candidate-content">
                        <div className="header-search">
                            <h1>Candidates</h1>
                           
                        </div>

                        {candidates.map((candidate, index) => (
                            <div key={index} className="candidate-profile">
                                <div className="candidate-card">
                                    <span className="candidate-name">{candidate.name}</span>
                                    <span className="candidate-role">{candidate.role}</span>
                                    <button onClick={() => handleRemoveCandidate(candidate.name)} className="remove-candidate-button">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="candidate-profile-button-container">
                            <button 
                                type="submit" 
                                className='next-button' 
                                onClick={handleNavigate}>                              
                            Next</button>
                            <button onClick={handleOpenModal} className="add-candidate-button">
                                Add New Candidate
                            </button>
                            <CandidateModal isOpen={modalOpen} onClose={handleCloseModal} onSave={handleAddCandidate} />
                        </div>
                        
                    </main>
                </div>
            </div>
        </>
    );
}

export default ElectionManagerCandidateProfiles;
