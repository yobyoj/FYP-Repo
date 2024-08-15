import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import './AccListEdit.css';

const GetAccList = async (cond) => {
  try {
    const response = await fetch('http://localhost:8000/getAccList/', {
      method: 'POST',
      body: JSON.stringify({ cond: cond }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data.data);
    return data.data; // Assuming the data is in the 'data' property of the response
  } catch (error) {
    console.error('Error fetching account list:', error);
    return []; // Return an empty array if there's an error
  }
};

function AccListEdit() {
  const [cond, setCond] = useState(''); // Cond initialized as an empty string
  const [data, setData] = useState([]); // State to store fetched data
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search input

  useEffect(() => {
    const fetchData = async () => {
      const result = await GetAccList(cond); // Fetch data using the condition
      setData(result);
    };

    fetchData();
  }, [cond]); // Refetch data whenever the condition changes

  const handleSearch = () => {
    setCond(searchTerm); // Update cond when the search button is clicked
  };

  const createTR = (item) => (
    <tr key={item[0]}> {/* Assuming "id" property for unique key */}
      <td>{item[1]}</td>
      <td>{item[2]}</td>
      <td>{item[3]}</td>
      <td>{item[4]}</td>
      <td>{item[5]}</td>
      <td><button className="Edit">RESET PASSWORD</button></td>
      <td><button className="Edit">EDIT DETAILS</button></td>
    </tr>
  );

    console.log("THIS IS THE DATA ", data)
  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm as the user types
          placeholder="Search by condition..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      
      
      <table className="space-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>User Type</th>
            <th>Reset Password</th>
            <th>Edit Details</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(createTR)
          ) : (
            <tr>
              <td colSpan="6">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AccListEdit;






