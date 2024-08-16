import React, { useState, useEffect } from 'react';
import './AccAddBulk.css';
//import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AccAddBulk() {
    const [username, setUsername] = useState('');
    const [usernames, setUsernames] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dpt, setDpt] = useState('');
    const [dptList, setDptList] = useState('');
    
    const [unsuccessfulList, setUnsuccessfulList] = useState([]);    

    const handleAccAdd = async () => {
        event.preventDefault();
        
        const usernameList = usernames.split('\n'); // Split usernames into an array
        
        //console.log(usernameList);

        try {
          const response = await fetch('http://127.0.0.1:8000/insertAccBulk/', {
            method: 'POST',
            body: JSON.stringify({ usernList: usernameList, passw: password, dpt: dpt}),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          //console.log("AWAIT FETCH HAPPENED.")

          const data = await response.json();

          if (data.Result.length === 0) {
            alert('All users successfully inserted');
          } else {
            setUnsuccessfulList(data.Result);
            let errorMessage = 'This user was not inserted into db: \n';
            errorMessage += unsuccessfulList.join('\n'); // Join unsuccessful usernames for alert
            alert(errorMessage);
          }
        } catch (error) {
          console.error('Error adding users:', error.message); // Handle errors appropriately (display error message)
        }
      };
    
    const getDptList = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/getDptList/', {
                method: 'POST',
                body: JSON.stringify({hi: 'hi'}),
                headers: {
                  'Content-Type': 'application/json',
                },
            });

            const r = await response.json();
            setDptList(r.Data)
            //console.log(r.Data)
        } catch (error) {
            console.error('Error:', error.message); // Handle errors appropriately (display error message)
        }
    }
    
    
    const createDepartmentOptions = () => {
    useEffect(() => {
      getDptList(); // Call getDptList on component mount
    }, []);

    return (
    dptList && dptList.length > 0 ? (  // Check if dptList is an array with elements
      dptList.map((department) => {
        const departmentName = department[0]; // Access the first element (department name)
        return (
          <option key={departmentName} value={departmentName}>
            {departmentName}
          </option>
        );
      })
    ) : (
      <p>Loading departments...</p> // Display loading message while fetching data
    )
  );
  };
    
    return (
    <>
        <h1> Bulk Add Accounts</h1>
        <form onSubmit={handleAccAdd}>
                    <table>
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="lbl"> <label htmlFor="username">Username:</label> </td>
                                <td className="textfieldCont">
                                    <textArea
                                      className="textfield" 
                                      type="text"
                                      id="usernames"
                                      name="usernames"
                                      value={usernames}
                                      onChange={(e) => setUsernames(e.target.value)}
                                    />
                                </td>
                            </tr>
                            
                            <tr>
                                <td className="lbl"> <label htmlFor="dpt">Department:</label> </td>
                                 <td className="inp">
                                    <select id="department" name="department" value={dpt} onChange={(e) => setDpt(e.target.value)}>
                                        <option value="" disabled>Choose an option</option>
                                        {createDepartmentOptions()}
                                    </select>
                                </td>
                            </tr>
                            
                            <tr>
                                <td className="lbl"><label htmlFor="password">Password:</label></td>
                                <td className="inp">               
                                    <input
                                      type="password"
                                      id="password"
                                      name="password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2"><button type="submit" className="add">Add</button></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
    </>)
}

export default AccAddBulk
