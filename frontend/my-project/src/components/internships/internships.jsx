import React, { useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../apis/api";
import Navbar from "../navabar/navbar";
import "./internships.css";

const InternshipOffers = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchInternships = async () => {
    try {
      const response = await api.get("/VJISS/internship_offers_details/");
      setInternships(response.data);
      console.log(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  fetchInternships();
}, []);
      
    
      
    
 

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