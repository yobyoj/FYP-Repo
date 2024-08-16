import React, { useState } from 'react';
import './AccMng.css';
//import Header from './Header';
import { useNavigate } from 'react-router-dom';
import AccAdd from './AccAdd';
import AccAddBulk from './AccAddBulk';
import AccDel from './AccDel';
import AccEdit from './AccEdit';
import SideBar from './Sidebar';
import NewHeader from './Header';


function AccMng({ children, style }) {
    const [activeChild, setActiveChild] = useState(0); // State for active child index
    
    const childComponents = [
        <AccAdd data="" />, // Use imported components
        <AccAddBulk data="" />,
        <AccEdit data="" />,
        <AccDel data="" />,
    ];
    
    
    const handleClick = (index) => {
        setActiveChild(index);
    };

    return (
        <div>
            <NewHeader />
            <div className = "page1">
                <div className="cont">
                    <h1>ADMIN PAGE </h1>
                    <div className="container">
                        <button onClick={() => handleClick(0)} className="btn">Add Accounts</button>
                        <button onClick={() => handleClick(1)} className="btn">Add Accounts in Bulk</button>
                        <button onClick={() => handleClick(2)} className="btn">Edit Accounts</button>
                        <button onClick={() => handleClick(3)} className="btn" >Delete Accounts</button>
                        <div className="child-container">{childComponents[activeChild]}</div>
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default AccMng;

