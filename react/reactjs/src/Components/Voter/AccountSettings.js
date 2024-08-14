import React from 'react';
import NewHeader from './NewHeader';
import Sidebar from './Sidebar';
import './AccountSettings.css';

function AccountSettings() {
  const stylization = {
    fontSize : '18px',
  }
  const cookieData = document.cookie
  const sessionData = cookieData.split(',');

  return (
    <div className="voter-app-container">
      <NewHeader />
      <div className="voter-main-content">
        <Sidebar />
        <div className="voter-content">
          <div className="voter-account-section">
            <h2>Account Settings</h2>
            <div className="voter-account-details">
              <div className='info'><span style={stylization}>Name: {sessionData[2]} {sessionData[3]}</span></div>
              <div className='info'><span style={stylization}>Username: {sessionData[1]}</span></div>
              <div className='info'><span style={stylization}>Department: {sessionData[4]}</span></div>
            </div>
            <button className="voter-reset-button">Reset Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
