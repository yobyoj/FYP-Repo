import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {

    const handleLogout = () => {
        // Clear all cookies
        
        //console.log(document.cookie);
        
        document.cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.split('=');
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
        
        //console.log(document.cookie);
        
        // Redirect to login page
        navigate('/');
      };

    const navigate = useNavigate();

    useEffect(() => {
        // Call handleLogout to clear cookies and redirect
        handleLogout();
    }, []);

    return (
        <div>
            <h1>Logged out!</h1>
            <p>You will be redirected to the login page shortly.</p>
        </div>
    );
}

export default Logout;
