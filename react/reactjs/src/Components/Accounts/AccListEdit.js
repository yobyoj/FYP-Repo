import './LoginForm.css';
import './AccListEdit.css';
//import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState } from 'react'; // Only useState needed

const accountsData = require('./accounts.json'); // Import data synchronously

function AccListEdit() {
  const [data, setData] = useState(accountsData); // Set initial data from import
  
  //console.log("DATATYPE OF DATA?", typeof(data))
  //console.log("DATA IS ARRAY?", Array.isArray(data))

  // Function to create table rows based on data
  const createTR = (item) => (
    <tr key={item.id}> {/* Assuming "id" property for unique key */}
      {/* Access data properties within the loop and display them in table cells */}
      <td>{item.email}</td>
      <td>{item.dpt}</td>
      <td><button class="Edit"> RESET PASSWORD </button></td>  {/* Assuming "pw" exists for password */}
      {/* Add more table cells for other properties */}
    </tr>
  );

  return (
    <div>
      <table class="space-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Department</th>
            <th>Password</th>  {/* Assuming "pw" exists for password */}
            {/* Add headers for other properties */}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(createTR)
          ) : (
            <tr>
              <td colSpan="4">No data found</td> {/* Adjust colspan for number of columns */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AccListEdit;

