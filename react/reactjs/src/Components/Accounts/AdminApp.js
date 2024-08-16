import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './AdminApp.css';
import AdminDashboard from './AdminDashboard';


function AdminApp({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        <Sidebar />
        <main className="main">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

export default AdminApp;
