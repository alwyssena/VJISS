import React, { useEffect, useState,useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../apis/api";
import Navbar from "../navabar/navbar";
import "./internships.css";
import { useNavigate } from "react-router-dom";

const InternshipOffers = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError]=useState("")
  const{token,logout}=useContext(AuthContext)
const navigate=useNavigate()

 useEffect(() => {
  const fetchInternships = async () => {
    console.log("token",!token)
     if (!token) {
        logout();
        navigate("/login");
        return;
      }
    try {
      const response = await api.get("/VJISS/internship_offers_details/");
      setInternships(response.data);
      console.log(response.data)
      setLoading(false)
    } catch (err) {
 if (err.response?.status === 401) {
        console.log("status")
          logout();
          navigate("/login");
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      


      console.error(error);
    }
  };

  fetchInternships();
}, [token,logout]);
      
    
      
    
 

  const handleApply = (id) => {
    alert(`Internship applied successfully!\nID: ${id}`);
  };

  if (loading) return <p className="loading">Loading internships...</p>;

  return (
    <>
    <Navbar/>
    <section className="internship-section">
      <h2 className="section-title">
        Internship Specializations
        <span className="underline"></span>
      </h2>

      <div className="internship-list">
        {internships.map((item) => (
          <div className="internship-card" key={item.internship_id}>
            <h3>{item.internship_name}</h3>
            <p>{item.internship_description}</p>

            <div className="tech-tags">
              {item.technologies.split(",").map((tech, index) => (
                <span key={index}>{tech.trim()}</span>
              ))}
            </div>

            <button onClick={() => handleApply(item.internship_id)}>
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  );
};

export default InternshipOffers;