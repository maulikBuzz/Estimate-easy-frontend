import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => { 
      const role = window.localStorage.getItem("role");
      localStorage.setItem("token", '');
 
    if (role == "User") { 
      navigate("/login");   
    } else { 
        navigate('/admin/login');
    }
  }, [navigate]);

    return null;
}

export default Logout;
