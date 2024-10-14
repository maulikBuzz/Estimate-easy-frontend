import Header from './Header';
import React, { useEffect } from 'react';   
import Sidebar from './Sidebar'; 
import { Outlet, useNavigate } from 'react-router-dom';

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = window.localStorage.getItem("role");

    if (role !== "User") {
      alert("d")
      navigate("/login");   
    }
  }, [navigate]);  

  return (
    <div>
      <Header />
      <div className='site-layout d-flex'> 
        <Sidebar />
        <div className="main-content flex-1">
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
