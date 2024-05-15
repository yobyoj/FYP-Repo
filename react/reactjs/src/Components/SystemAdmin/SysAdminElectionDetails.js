import React from 'react';
import './SysAdminElectionDetails.css';
import Header from './Header';

function ElectionDetails() {
  return (
    <>
        <Header />        
        <div className='container'>
            <div className="election-details-page">
                <aside className="sidebar">
                <h1>New Election</h1>
                <ul>
                    <li className="active">Election Details</li>
                    <li>Candidate Profiles</li>
                    <li>List of Voters</li>
                    <li>Summary</li>
                </ul>
                </aside>
                <main className="form-content">
                <h1>Election Details</h1>
                <form>
                    <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" />
                    </div>

                    <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" name="description" />
                    </div>

                    <div className="form-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input type="date" id="start-date" name="start-date" />
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="end-date">End Date</label>
                    <input type="date" id="end-date" name="end-date" />
                    </div>

                    <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select id="timezone" name="timezone">
                        <option value="GMT8">Singapore GMT+8 (Greenwich Meantime)</option>
                        <option value="GMT-4">New York GMT-4 (Greenwich Meantime)</option>
                        <option value="GMT1">London GMT+1 (Greenwich Meantime)</option>
                        <option value="GMT10">Sydney GMT+10 (Greenwich Meantime)</option>
                        <option value="GMT9">Tokyo GMT+9 (Greenwich Meantime)</option>
                    </select>
                    </div>
                    <button type="submit" className='election-details-button'>Next</button>
                </form>
                </main>
            </div>
        </div>
    </>
);}

export default ElectionDetails;
