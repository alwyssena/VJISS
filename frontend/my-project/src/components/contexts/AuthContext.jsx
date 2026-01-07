import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [is_superuser, setIs_superuser] = useState(localStorage.getItem("admin")); // 👈
  const [is_staff,setIs_staff]=useState(localStorage.getItem("emp"))
  const navigate = useNavigate();
  const login = (token, is_superuser,is_staff) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", is_superuser);
    localStorage.setItem("emp",is_staff)
    setToken(token);
    setIs_superuser(is_superuser);
    setIs_staff(is_staff);
    
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setIs_superuser(null);
  };

  return (
    <AuthContext.Provider value={{ token, is_superuser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
