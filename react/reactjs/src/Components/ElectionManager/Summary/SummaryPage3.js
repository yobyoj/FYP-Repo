import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import './SummaryPage3.css';
import { useNavigate } from "react-router-dom";

function Summary3({ formData, resetFormData }) {    
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    const handleSubmit = async () => {
        setIsSubmitting(true); // Disable the button on submit
        try {
            const response = await fetch('http://localhost:8000/api/form-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            
            if (data.status === 'success') {
                console.log('Form data submitted successfully:', data.message);
                resetFormData();
                alert('Election created successfully!');
                navigate('/election-manager/');
            } else {
                // Custom error handling based on backend response
                if (data.message.includes('The following candidates have mismatched details')) {
                    const missingCandidates = data.message.match(/\[(.*?)\]/)[1];
                    alert(`Error: The following candidate(s) have mismatched details: ${missingCandidates}. Please check their information.`);
                } else if (data.message.includes('The following voter emails do not exist')) {
                    const missingVoters = data.message.match(/\[(.*?)\]/)[1];
                    alert(`Error: The following voter email(s) do not exist in the system: ${missingVoters}. Please verify the voters' emails.`);
                } else if (data.message.includes('Invalid name format for candidate')) {
                    alert(`Error: Invalid naming format for the candidates. Please verify.`);
                } else {
                    alert('Error submitting form data. Please check the form and try again.');
                }
                setIsSubmitting(false); // Re-enable the button on error
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
            alert('An unexpected error occurred. Please try again.');
            setIsSubmitting(false); // Re-enable the button on error
        }
    };
    

    const createElection = () => {
        if (formData.title === '' || formData.description === '' || formData.start_date === '' 
            || formData.end_date === '' || formData.timezone === '' || formData.electionType === ''){
                if (formData.voters.length === 0 && formData.votersDept.length === 0)
                {
                    alert("You still have missing form fields. Please fill them up.");
                }
                else
                {
                    alert("You still have missing form fields. Please fill them up.");
                }
            }
        else{
            handleSubmit();
        }
    }

    const handleNavigate = () =>{
        navigate('/election-manager/summary-2');
    }

    return (
        <>
            <Header />
            <div className="container">
                <div className="summary-page3">
                <Sidebar electionType={formData.electionType}/>
                    <main className="summary-page3-content">
                        <h1>Election Status</h1>
                        <select id="election-status" >
                            <option value="scheduled">Scheduled</option>
                        </select>

                        <div className="summary3-button-container">
                            <button
                                className="create-election-button"
                                onClick={createElection}
                                disabled={isSubmitting} // Disable when submitting
                            >
                                Create Election
                            </button>
                            <button className="create-election-button" onClick={handleNavigate}>Back</button>
                        </div>
                     </main>
                </div>
            </div>
        </>
    );
}

export default Summary3;
