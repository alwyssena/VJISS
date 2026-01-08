import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  console.log({children})
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [is_superuser, setIs_superuser] = useState(localStorage.getItem("admin")); // 👈
  const [is_staff,setIs_staff]=useState(localStorage.getItem("emp"))
  const [public_id,setPublicId]=useState(localStorage.getItem("publicId")|| null)
  console.log("mt",public_id)
  const navigate = useNavigate();
  const login = (token, is_superuser,is_staff,public_id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", is_superuser);
    localStorage.setItem("emp",is_staff)
    localStorage.setItem("publicId",public_id)
    setToken(token);
    setIs_superuser(is_superuser);
    setIs_staff(is_staff);
    setPublicId(public_id)
    
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setIs_superuser(null);
  };

  return (
    <AuthContext.Provider value={{ token, is_superuser, login, logout,public_id,is_staff}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
