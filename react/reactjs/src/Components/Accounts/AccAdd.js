import React, { useState, useEffect } from 'react';
//import './LoginForm.css';
import './AccAdd.css';
//import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';




function AccAdd() {
    const [username, setUsername] = useState('');
    const [usernames, setUsernames] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [dpt, setDpt] = useState('');
    const [dptList, setDptList] = useState('');
    
    const handleAccAdd = async (event) => {
        event.preventDefault();
        
        // const selectedUsertype = event.target.options.selectedIndex;
        // console.log("Selected usertype:", selectedUsertype);
        
        //console.log(username +" "+ password +" "+ usertype+" "+dpt)

        
        try {
            const response = await fetch('http://127.0.0.1:8000/insertAcc/', {
                method: 'POST',
                body: JSON.stringify({ usern: username, passw: password, usert: usertype, frstn: firstname, lastn: lastname, dpt: dpt}),
                headers: {
                  'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            //console.log("BACKEND RETURNED WITH", data)
            alert("Account insertion was " + data.RESULT);
        } catch (error) {
            console.error('Error:', error.message); // Handle errors appropriately (display error message)
        }
    }
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
    <div className="addForm">
      <form onSubmit={handleAccAdd}>
        <thead>
          <tr>
            <th colSpan="2">
              <h1>Add account</h1>
            </th>
          </tr>
        </thead>
        <table className="table">
          <tbody>
            <tr>
              <td className="lbl">
                <label htmlFor="username">Username:</label>
              </td>
              <td className="inp">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="lbl">
                <label htmlFor="firstname">First Name:</label>
              </td>
              <td className="inp">
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="lbl">
                <label htmlFor="lastname">Last Name:</label>
              </td>
              <td className="inp">
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="lbl">
                <label htmlFor="usert">Usertype:</label>
              </td>
              <td className="inp">
                <select
                  id="usertype"
                  name="usertype"
                  value={usertype}
                  onChange={(e) => setUsertype(e.target.value)}
                >
                  <option value="" disabled>Choose an option</option>
                  <option value="Voter">Voter</option>
                  <option value="Election Manager">Election Manager</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </td>
            </tr>

            <tr>
              <td className="lbl">
                <label htmlFor="dpt">Department:</label>
              </td>
              <td className="inp">
                  <select id="department" name="department" value={dpt} onChange={(e) => setDpt(e.target.value)}>
                    <option value="" disabled>Choose an option</option>
                    {createDepartmentOptions()}
                  </select>
              </td>
            </tr>

            <tr>
              <td className="lbl">
                <label htmlFor="password">Default Password:</label>
              </td>
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
              <td colSpan="2">
                <button type="submit" className="add">
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default AccAdd

