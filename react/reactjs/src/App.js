import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import VoterAppLayout from "./VoterAppLayout";
import ElectionManagerAppLayout from "./ElectionManagerAppLayout";

// Import components for VoterApp
import Dashboard from "./Components/Voter/Dashboard";
import ElectionResults from "./Components/Voter/ElectionResults";
import AccountSettings from "./Components/Voter/AccountSettings";
import PrivacyPolicy from "./Components/Voter/PrivacyPolicy";
import Logout from "./Logout";
import Voting from "./Components/Voter/Voting";
import LoginForm2 from './Components/Accounts/LoginForm2';

// Import components for SystemAdminApp
import AccMng from './Components/Accounts/AccMng';
//import AdminApp from './Components/Accounts/AdminApp';
import AdminDashboard from './Components/Accounts/AdminDashboard';
import AdminElectionResults from "./Components/Accounts/AdminElectionResults";

// Import components for ElectionManagerApp
import ElectionManager from './ElectionManager'; // New ElectionManager component

// Import components for SystemAdminApp
import SystemAdmin from './SystemAdmin'; // New ElectionManager component

function App() {
  //const navigate = useNavigate();
  
  function getUserTypeFromCookie() {
    
    const cookieData = document.cookie
    const sessionData = cookieData.split(',');
    //console.log("Usertype is ", sessionData[5])
    
    
    return sessionData[5]; // assuming the cookie name is `usertype`
  }
  
  function ProtectedRoute({ allowedUserType, element }) {
    const userType = getUserTypeFromCookie();

    if (userType === allowedUserType) {
        return element;
    } else {

    }
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm2 />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* VoterApp Routes */}
        <Route 
            path="/voter/*" 
            element={<ProtectedRoute allowedUserType="Voter" element={<VoterAppLayout><VoterApp /></VoterAppLayout>} />} 
        />

        {/* ElectionManager Routes */}
        <Route 
            path="/election-manager/*" 
            element={<ProtectedRoute allowedUserType="Election Manager" element={<ElectionManagerAppLayout><ElectionManager /></ElectionManagerAppLayout>} />} 
        />

        {/* SystemAdmin Routes */}
        <Route 
            path="/system-admin/*" 
            element={<ProtectedRoute allowedUserType="System Admin" element={<SystemAdmin />} />} 
        />
        
        
      </Routes>
    </Router>
  );
}



function VoterApp() {
  return (
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/election-results' element={<ElectionResults />} />
        <Route path='/account-settings' element={<AccountSettings />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/election-voting' element={<Voting />} />
      </Routes>
  );
}




export default App;
