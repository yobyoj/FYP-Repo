import './ArchivedElections.css';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ArchivedElections() {    
    const [elections, setElections] = useState([]); // All elections
    const navigate = useNavigate();

    const handleNavigate = (data) => {
        navigate('/election-manager/' + data);
    }

    const searchbarStyle = {
        width: '35%',
    }

    useEffect(() => {
        fetchElections();
    }, []);

    const fetchElections = async () => {
        try {
            console.log('Fetching elections...');
            const response = await axios.get('http://127.0.0.1:8000/api/view-archived-elections/');
            //console.log('Fetched data:', response.data);
            setElections(response.data);
        } catch (error) {
            console.error('Error fetching election data:', error);
        }
    };

    const formatDate = (dateString, timezone) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZone: timezone,
            timeZoneName: 'short',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <>
            <Header />
            <div className='container'>
                <div className="election-details-page">
                    <main className="form-content">
                        <div className="archived-header">
                            <div className="dashboardText"><span>Archived Elections</span></div>
                            <input type="text" style={searchbarStyle} placeholder="Search by election title" />
                        </div>

                        <div className="election-item-titles">
                            <div><u>Election Name</u></div>
                            <div><u>Timezone</u></div>
                            <div><u>Start Date</u></div>
                            <div><u>End Date</u></div>
                        </div>

                        {elections.map(election => (
                            <button
                                key={election.archived_election_id}  // Ensure this key is unique
                                className="election-item"
                            >
                                <div>{election.title}</div>
                                <div>{election.timezone}</div>
                                <div>{formatDate(election.startDate, election.timezone)}</div>
                                <div>{formatDate(election.endDate, election.timezone)}</div>
                            </button>
                        ))}
                    </main>
                </div>
            </div>
        </>
    );
}

export default ArchivedElections;
