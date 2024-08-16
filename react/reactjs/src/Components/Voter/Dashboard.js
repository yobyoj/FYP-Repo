import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewHeader from './NewHeader';
import Sidebar from './Sidebar';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingElection, setPendingElection] = useState([]);
  const [processingElection, setProcessingElection] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get_user_elections/', {
          params: {
            userid: userId,
          },
        });
  
        const allElections = response.data.elections || [];

        if (!Array.isArray(allElections)) {
          throw new Error('Invalid data format received from the server');
        }
  
        // Filter elections into pending and processing categories
        const pending = allElections.filter(election => !election.has_voted);
        const processing = allElections.filter(election => election.has_voted);
  
        setPendingElection(pending);
        setProcessingElection(processing);

      } catch (err) {
        setError(err.message || 'An error occurred while fetching the elections.');
      }
    };

    const cookieData = document.cookie;
    const sessionData = cookieData.split(',');

    // Extract the numeric value from the first element
    const userIdString = sessionData[0]; // This will be "sessionData=xx"
    const userId = userIdString.split('=')[1]; // This extracts "xx"

    fetchElections();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredElections = pendingElection.filter(election =>
    election.title && election.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleVote = (electionId) => {
    const votedElection = pendingElection.find(election => election.id === electionId);
  
    if (votedElection) {
      navigate('/voter/election-voting', { state: { election: votedElection } });
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
    <div className="voter-app-container">
      <NewHeader />
      <div className="voter-main-content">
        <Sidebar />
        <div className="voter-content">
          {/* Pending Elections Section */}
          <div className="voter-elections-section">
            <div className="voter-election-section-header">
              <h2>Pending Elections</h2>
              <input
                type="text"
                placeholder="Search for pending elections"
                onChange={handleSearch}
                value={searchTerm}
              />
            </div>
  
            {error && <div>Error: {error}</div>}
  
            <div className="voter-elections-list">
              {filteredElections.map(election => (
                <div key={election.id} className="voter-election">
                  <div className="voter-election-info">
                    <div>
                      <span><b><u>{election.title}</u></b></span>
                    </div>
                    <div>Start Date: {formatDate(election.startDate, election.timezone)}</div>
                    <div>End Date: {formatDate(election.endDate, election.timezone)}</div>
                    <div>Timezone: {election.timezone} </div>
                  </div>
                  <div className="voter-election-deadline">
                    <button onClick={() => handleVote(election.id)}>Vote</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Processing Elections Section */}
          <div className="voter-elections-section">
            <h2>Processing Elections</h2>
            <div className="voter-elections-list">
              {processingElection.map(election => (
                <div key={election.id} className="voter-election">
                  <div className="voter-election-info">
                    <div>
                      <span><b><u>{election.title}</u></b></span>
                    </div>
                    <div>Start Date: {formatDate(election.startDate, election.timezone)}</div>
                    <div>End Date: {formatDate(election.endDate, election.timezone)}</div>
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

export default Dashboard;
