import React, { useState, useEffect } from 'react';
import './AccEditForm.css'

function AccEditForm({ user, onClose }, ) {
  const [usern, setUsern] = useState(user[1]); // User entered username
  const [frstn, setFrstn] = useState(user[2]); // User entered first name
  const [lastn, setLastn] = useState(user[3]);
  const [dpt, setDpt] = useState(user[4]);
  const [usert, setUsert] = useState(user[5]);
  const [dptList, setDptList] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await fetch('http://localhost:8000/updateAcc/', {
        method: 'POST',
        body: JSON.stringify({ username: usern,
                                firstname: frstn,
                                lastname: lastn,
                                department: dpt,
                                usertype: usert
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      //console.log(result.Result)
      
      if (result.Result) {
        alert('RESULT IS', result.Result);
        onClose();
      } else {
        alert('Backend connection had an error');
      }
    } catch (error) {
      console.error('Error editing account:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    onClose(); // Trigger callback function to close the form
  };

  // ... form UI with input fields, submit button, and cancel button


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
    <div className="edit-form-overlay">
      {/* Black background with 75% transparency */}
      <div className="edit-form-backdrop" onClick={onClose} />

      <div className="edit-form-container">
        {/* Form with centered content */}
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td><label htmlFor="usern">Username:</label></td>
                <td>
                  <input
                    type="text"
                    id="usern"
                    defaultValue={usern}
                    onChange={(e) => setUsern(e.target.value)}
                    disabled // Disable username editing (optional)
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="frstn">Firstname:</label></td>
                <td>
                  <input 
                    type="text" 
                    id="frstn" 
                    defaultValue={frstn} 
                    onChange={(e) => setFrstn(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="lastn">Lastname:</label></td>
                <td>
                  <input 
                    type="text" 
                    id="lastn" 
                    defaultValue={lastn} 
                    onChange={(e) => setLastn(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="dpt">Department:</label></td>
                <td>
                  <select id="department" name="department" value={dpt} onChange={(e) => setDpt(e.target.value)}>
                    <option value="" disabled>Choose an option</option>
                    {createDepartmentOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <td><label htmlFor="usert">Usertype:</label></td>
                <td>
                <select
                  id="usert"
                  name="usert"
                  value={usert}
                  onChange={(e) => setUsert(e.target.value)}
                >
                  <option value="" disabled>Choose an option</option>
                  <option value="Voter">Voter</option>
                  <option value="Election Manager">Election Manager</option>
                  <option value="System Admin">System Admin</option>
                </select>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={onClose}>
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default AccEditForm;
