import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginForm.module.css';

const LoginForm2 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const recieved = await response.json();
      const data = recieved
      //const recieved_cookie = recieved.token
      const token = data.token//document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
      
      
      console.log("data is ", data)
      console.log("token is ", token)
      console.log("message is ",data.message)
      console.log("error is ",data.error)
      console.log("Cookie file is ", document.cookie)
      
      function getCookie(name) {
        const cookieValue = document.cookie.match(name);
        return cookieValue ? cookieValue[2] : null;
      }

      if (data.data) {
        document.cookie = "sessionData=" + data.data + "; path=/; expires=" + new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString();
        
        const cookieData = document.cookie
        const sessionData = cookieData.split(',');
        console.log("Usertype is ", sessionData[5])
        nav(sessionData[5])
      } else {
        alert('Login failed. Please enter the correct Username and Password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const saveToken = (token) => {
    localStorage.setItem('jwtToken', token);
  };

  // const getSessionData = async () => {
  //   try {
  //     const token = localStorage.getItem('jwtToken');
  //     const response = await axios.get('http://127.0.0.1:8000/verify_jwt/', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });
  //     const { message, decodedToken } = response.data;

  //     if (message === 'Token is valid') {
  //       nav(decodedToken.usertype);
  //     } else {
  //       console.error('Session verification failed');
  //     }
  //   } catch (error) {
  //     console.error('Error verifying session:', error);
  //   }
  // };

  const nav = (userType) => {
    switch (userType) {
      case 'Voter':
        navigate('/voter');
        break;
      case 'Election Manager':
        navigate('/election-manager');
        break;
      case 'System Admin':
        navigate('/system-admin');
        break;
      default:
        console.error('Unknown user type');
    }
  };
  return (
    <div className={styles.page}>
    
      <div className={styles.leftDiv}>
        {/* Left side content if any */}
      </div>

      <div className={styles.rightDiv}> <div className={styles.loginForm}>
      
        <form onSubmit={handleLogin}>
          <table className = {styles.login}>
            <thead className = {styles.login}>
              <tr className = {styles.login}>
                <th className = {styles.login} colSpan="2"><h1>Login</h1></th>
              </tr>
            </thead>
            <tbody>
              <tr className = {styles.login}>
                <td className={styles.lbl} className = {styles.login}> <label htmlFor="username">Username:</label> </td>
                <td className={styles.inp} className = {styles.login}>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </td>
              </tr>

              <tr>
                <td className={styles.lbl} className = {styles.login}><label className = {styles.login} htmlFor="password">Password:</label></td>
                <td className={styles.inp} className = {styles.login}>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </td>
              </tr>
              <tr className = {styles.login}>
                <td className = {styles.login} colSpan="2"><button type="submit" className={styles.loginBtn}>Login</button></td>
              </tr>
              <tr>
                <td className = {styles.login} colSpan="2"> <Link to="/forgot-password" class={styles.forgotLink}>Forgot Password?</Link> </td>
              </tr>
            </tbody>
          </table>
        </form></div>
      </div>
    </div>
  );
}

export default LoginForm2;
