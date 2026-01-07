import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../navabar/navbar";
import feather from "feather-icons";
import "./dashboard.css";


const Dashboard = () => {
  const { token, role ,logout} = React.useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);


  const navigate=useNavigate()
  console.log("Dashboard token:", token);
 

useEffect(() => {
  feather.replace();

  

  document.querySelectorAll(".fade-in").forEach((el) => {
    el.classList.add("animate-fade-in");
  });

  // ✅ cleanup must be a FUNCTION
  return () => {
    // nothing to cleanup for feather
  };
}, [token]);


  



useEffect(() => {
  if (token) {
    // if logged in → ensure normal behaviour
    setShowAuthPopup(false);
    document.body.style.overflow = "auto";
    return;
  }

  const interval = setInterval(() => {
    // 🔒 blur + scroll off
    setShowAuthPopup(true);
    document.body.style.overflow = "hidden";

    // ⏳ popup visible time
    setTimeout(() => {
      setShowAuthPopup(false);
      document.body.style.overflow = "auto";
    }, 3000); // blur stays for 2 sec

  }, 11000); // repeats every 11 sec

  return () => {
    clearInterval(interval);
    document.body.style.overflow = "auto";
  };
}, [token]);










   const handleLogout = () => {
    logout();
    navigate("/");
  };
    const handleLogIn = () => {
      
    navigate("/login");
  };

  return (
    


      <div className={`page ${showAuthPopup ? "blur-background" : ""}`}>


<Navbar/>


       

      {/* HERO SECTION */}
      <section id="home" className="hero fade-in">
        <h1>VJ Innovate Software Solutions</h1>
        <p>Empowering the next generation of developers</p>
        <div className="hero-buttons">
          <a href="#courses" className="btn-primary">Explore Courses</a>
          <a href="#services" className="btn-outline">Our Services</a>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <h2 className="section-title fade-in">Our Services</h2>

        <div className="card-grid">
          <div className="card fade-in">
            <h3>E-commerce Development</h3>
            <p>Custom online stores with payment integration.</p>
          </div>

          <div className="card fade-in">
            <h3>Web Development</h3>
            <p>Fast, secure, scalable web applications.</p>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="section light-bg">
        <h2 className="section-title fade-in">Our Courses</h2>

        <div className="card-grid">
          <div className="card fade-in">Python Programming</div>
          <div className="card fade-in">Python + Django + DRF</div>
          <div className="card fade-in">Java Programming</div>
          <div className="card fade-in">HTML & CSS</div>
        </div>
      </section>

      {/* INTERNSHIP */}
      <section id="internship" className="section">
        <h2 className="section-title fade-in">Internship Program</h2>

        <div className="card-grid">
          <div className="card fade-in">Industry Training</div>
          <div className="card fade-in">Live Projects</div>
          <div className="card fade-in">Expert Mentors</div>
          <div className="card fade-in">Placement Support</div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section light-bg">
        <h2 className="section-title fade-in">Contact Us</h2>

        <form className="contact-form fade-in">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" required></textarea>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 VJ Innovate Software Solutions
      </footer>



{showAuthPopup && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>You are not logged in</h3>
      <p>You can still browse the dashboard.</p>
    </div>
  </div>
)}






    </div>
  );
};

export default Dashboard;
