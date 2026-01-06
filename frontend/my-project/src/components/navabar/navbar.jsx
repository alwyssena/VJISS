import { useState, useContext, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import feather from "feather-icons";
import { NavbarContext } from "../contexts/navbarContext";
import './navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { token, handleLogout, handleLogin } = useContext(NavbarContext);

  useEffect(() => {
    feather.replace();
  }, [menuOpen]);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => goTo("/")}>
          <img src="vjiss.ico" alt="Logo" />
          <span>VJ Innovative</span>
        </div>

        {/* Desktop Menu */}
 <ul className="nav-links desktop-only">
  <li className={location.pathname === "/" ? "active" : ""} onClick={() => goTo("/")}>Home</li>
  <li className={location.pathname === "/services" ? "active" : ""} onClick={() => goTo("/services")}>Services</li>
  <li className={location.pathname === "/courses" ? "active" : ""} onClick={() => goTo("/courses")}>Courses</li>
  <li className={location.pathname === "/internship" ? "active" : ""} onClick={() => goTo("/internship")}>Internship</li>
  <li className={location.pathname === "/jobs" ? "active" : ""} onClick={() => goTo("/jobs")}>Job Notifications</li>
  <li className={location.pathname === "/trainers" ? "active" : ""} onClick={() => goTo("/trainers")}>Trainers Info</li>
  <li className={location.pathname === "/about" ? "active" : ""} onClick={() => goTo("/about")}>Contact</li>

  <li>
    <button
      className={`logout-btn ${!token ? "blink-border" : ""}`}
      onClick={token ? handleLogout : handleLogin}
    >
      {token ? "Logout" : "Login"}
    </button>
  </li>
</ul>


        {/* Mobile Button */}
        <button
          className="menu-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i data-feather="menu"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
  <span className={location.pathname === "/" ? "active" : ""} onClick={() => goTo("/")}>Home</span>
  <span className={location.pathname === "/services" ? "active" : ""} onClick={() => goTo("/services")}>Services</span>
  <span className={location.pathname === "/courses" ? "active" : ""} onClick={() => goTo("/courses")}>Courses</span>
  <span className={location.pathname === "/internship" ? "active" : ""} onClick={() => goTo("/internship")}>Internship</span>
  <span className={location.pathname === "/jobs" ? "active" : ""} onClick={() => goTo("/jobs")}>Job Notifications</span>
  <span className={location.pathname === "/trainers" ? "active" : ""} onClick={() => goTo("/trainers")}>Trainers Info</span>
  <span className={location.pathname === "/about" ? "active" : ""} onClick={() => goTo("/about")}>Contact</span>

  <button
    className={`logout-btn ${!token ? "blink-border" : ""}`}
    onClick={token ? handleLogout : handleLogin}
  >
    {token ? "Logout" : "Login"}
  </button>
</div>

      )}
    </nav>
  );
};

export default Navbar;
