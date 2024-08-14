import React from 'react';
import NewHeader from './NewHeader';
import Sidebar from './Sidebar';
import './ElectionResults.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ElectionResults() {
    const [searchTerm, setSearchTerm] = useState('');
    const [completedElectionList, setCompletedElectionList] = useState([]);

    useEffect(() => {
        fetchCompletedElections();
    }, []);

    const fetchCompletedElections = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/completed-elections/');
            setCompletedElectionList(response.data);
            console.log('Completed Elections List:', response.data);
        } catch (error) {
            console.error('Error fetching election data:', error);
        }
    };
    
    const handleSearch = (event) => setSearchTerm(event.target.value);

    const filteredElections = completedElectionList.filter(election =>
        election.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTopicOrCandidateName = (election, index) => {
        if (election.candidates.length > 0) {
            return election.candidates[index % election.candidates.length].name;
        } else if (election.topics.length > 0) {
            return election.topics[index % election.topics.length].name;
        }
        return "Unknown";
    };

    return (
        <div className="voter-app-container">
            <NewHeader />
            <div className="voter-main-content">
                <Sidebar />
                <div className="voter-content">
                    <div className="voter-elections-section">
                        <div className="voter-election-section-header">
                            <h2>Completed Election Results</h2>
                            <input 
                                type="text"
                                placeholder="Search for completed election results"
                                onChange={handleSearch}
                                value={searchTerm}
                            />
                        </div>
                        <div className="voter-elections-list">
                            {filteredElections.map((election, index) => (
                                <div key={election.completed_election_id} className="voter-election">
                                    <div className="voter-election-results-info">
                                        <div><strong>{election.title}</strong></div>
                                        <div className='voter-election-results'>
                                            <div>Election ID: {election.election}</div>
                                            <div>Name: {getTopicOrCandidateName(election, index)}</div>
                                            <div>Vote Count: {election.tally}</div>
                                            {/* <div>Total Votes: {election.total_votes}</div> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ElectionResults;
