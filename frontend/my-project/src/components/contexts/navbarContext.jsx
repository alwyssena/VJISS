import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const NavbarContext = createContext();

const NavbarProvider = ({ children }) => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <NavbarContext.Provider value={{ token, handleLogout, handleLogin }}>
      {children}
    </NavbarContext.Provider>
  );
};

export default NavbarProvider;
