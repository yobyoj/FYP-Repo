import React, { useState, useEffect, useRef } from 'react';
import './LoginForm.css';
import './AccListEdit.css';
import AccEditForm from './AccEditForm';

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
  const [isEditOpen, setIsEditOpen] = useState(false); // State to track edit form visibility
  const [selectedUser, setSelectedUser] = useState(null); // User to be edited
  const searchBtn = useRef(null);
    
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
      <td><button className="rstBtn">RESET PASSWORD</button></td>
      <td>
        <button className="edtBtn" onClick={() => handleEdit(item)}>
            EDIT DETAILS
        </button>
      </td>
    </tr>
  );

    console.log("THIS IS THE DATA ", data)

  const handleEdit = (item) => {
    setSelectedUser(item);
    setIsEditOpen(true);
    console.log("Dis isEditOopen set to true?", isEditOpen)
  };
  
  const handleEditClose = (edited) => { 
    setIsEditOpen(false);
    setSelectedUser(null);
    setCond('z');
    setCond('');
  };
  

  
  return (
    <div>
      <div className="searchCont">
        <table className="searchCont">
        <tbody>
          <tr>
            {/* Search bar cell */}
            <td>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm as the user types
                placeholder="Search by condition..."
                className="searchBar"
              />
            </td>
            {/* Search button cell */}
            <td>
              <button onClick={handleSearch} className="searchBtn">
                Search
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
      
     {isEditOpen && (
      <AccEditForm
        user={selectedUser}
        onClose={handleEditClose}
      />
    )}
    </div>
  );
}

export default AccListEdit;
