/* for election manager */

import React from 'react';
import Header from '../../Header';
import { useNavigate, useLocation } from 'react-router-dom';

function ScheduledElectionSummary() {    
    const navigate = useNavigate();
    const location = useLocation();
    const { election } = location.state;

    const handleNavigate = () => {
        navigate('/election-manager/scheduled-election-summary2', { state: { election } });
    };

       return (
        <>
            <Header />        
            <div className='container'>
                <div className="election-details-page">
                    <main className="form-content">
                    <h1>Scheduled Election - Summary</h1>
                    <div className="election-details-summary">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" name="title" value={election.title} disabled/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input type="text" id="description" name="description" value={election.description} disabled/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="start-date">Start Date</label>
                            <input type="datetime-local" id="start-date" name="start-date" value={election.endDate} disabled/>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="end-date">End Date</label>
                            <input type="datetime-local" id="end-date" name="end-date" value={election.endDate} disabled />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timezone">Timezone</label>
                            <select id="timezone" name="timezone" value={election.timezone} disabled>
                                <option value="GMT+8">Singapore GMT+8 (Greenwich Mean Time)</option>
                                <option value="GMT+5">Pakistan GMT+5 (Greenwich Mean Time)</option>
                                <option value="GMT+5:30">Sri Lanka GMT+5:30 (Greenwich Mean Time)</option>
                                <option value="GMT+5:45">Nepal GMT+5:45 (Greenwich Mean Time)</option>
                                <option value="GMT+6">Bangladesh GMT+6 (Greenwich Mean Time)</option>
                                <option value="GMT+6:30">Myanmar GMT+6:30 (Greenwich Mean Time)</option>
                                <option value="GMT+7">Thailand GMT+7 (Greenwich Mean Time)</option>
                                <option value="GMT+7">Indonesia GMT+7 (Greenwich Mean Time)</option>
                                <option value="GMT+8">China GMT+8 (Greenwich Mean Time)</option>
                                <option value="GMT+8">Hong Kong GMT+8 (Greenwich Mean Time)</option>
                                <option value="GMT+8">Malaysia GMT+8 (Greenwich Mean Time)</option>
                                <option value="GMT+8">Philippines GMT+8 (Greenwich Mean Time)</option>
                                <option value="GMT+9">Korea GMT+9 (Greenwich Mean Time)</option>
                                <option value="GMT+9">Japan GMT+9 (Greenwich Mean Time)</option>
                                <option value="GMT+9:30">Australia (Adelaide) GMT+9:30 (Greenwich Mean Time)</option>
                                <option value="GMT+10">Australia (Sydney) GMT+10 (Greenwich Mean Time)</option>
                                <option value="GMT+10">Papua New Guinea GMT+10 (Greenwich Mean Time)</option>
                                <option value="GMT+11">Solomon Islands GMT+11 (Greenwich Mean Time)</option>
                                <option value="GMT+11">New Caledonia GMT+11 (Greenwich Mean Time)</option>
                                <option value="GMT+12">Fiji GMT+12 (Greenwich Mean Time)</option>
                                <option value="GMT+12">New Zealand GMT+12 (Greenwich Mean Time)</option>
                            </select>
                        </div>

                        
                        <button className='next-button' onClick={()=>handleNavigate()}>Next</button>
                    </div>
                    </main>
                </div>
            </div>
        </>
);}

export default ScheduledElectionSummary;
