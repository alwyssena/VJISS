
import { useEffect, useState } from "react";
import api from '../apis/api'
import Navbar from "../navabar/navbar";
import "./aboutcompany.css";


function AboutCompany() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

useEffect(() => {
  const fetchCompany = async () => {
    try {
      const response = await api.get("/VJISS/company_info_details/");

      console.log(response.status); // 200
      setCompany(Array.isArray(response.data) ? response.data[0] : response.data);

    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch company details");
    } finally {
      setLoading(false);
    }
  };

  fetchCompany();
}, []);


  if (loading) {
    return (
      <div className="status-container">
        <div className="loader"></div>
        <p>Loading company profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="status-container error">{error}</div>;
  }

  return (
    <>
      {/* HERO ABOUT SECTION */}
      <Navbar/>
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-content animate-slide-up">
            {company?.company_logo && (
              <div className="logo-container animate-fade-in">
                <img
                  src={
                    company.company_logo.startsWith("http")
                      ? company.company_logo
                      : `http://127.0.0.1:8000${company.company_logo}`
                  }
                  alt={company.company_name}
                  className="hero-logo"
                />
              </div>
            )}
            <div className="hero-text">
              <h1 className="animate-slide-up-delay">{company.company_name}</h1>
              <div className="hero-divider animate-expand"></div>
              <p className="animate-fade-in-delay">{company.company_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & LOCATION */}
      <section className="contact-section">
        <div className="contact-container">
          {/* DYNAMIC CONTACT INFO */}
          <div className="contact-info animate-slide-right">
            <h2 className="section-title animate-slide-up">Get in Touch</h2>
            <div className="divider accent animate-expand"></div>
            
            <div className="contact-details">
           
              






<div className="contact-grid">

  {/* 📍 OFFICE ADDRESS */}
  {company.offce_address && (
    <div className="info-item animate-fade-in-item">
      <span className="icon">📍</span>
      <div>
        <strong>Office</strong>
        <p>{company.offce_address}</p>
      </div>
    </div>
  )}

  {/* 📞 CLICK TO CALL */}
  {company.contact_phone && (
    <div className="info-item animate-fade-in-item delay-1">
      <span className="icon">📞</span>
      <div>
        <strong>Call Us</strong>
        <p>
          <a
            href={`tel:${company.contact_phone}`}
            className="contact-link"
          >
            {company.contact_phone}
          </a>
        </p>
      </div>
    </div>
  )}

  {/* ✉️ CLICK TO EMAIL */}
  {company.contact_email && (
    <div className="info-item animate-fade-in-item delay-2">
      <span className="icon">✉️</span>
      <div>
        <strong>Email</strong>
        <p>
          <a
            href={`mailto:${company.contact_email}?subject=Inquiry from Website`}
            className="contact-link"
          >
            {company.contact_email}
          </a>
        </p>
      </div>
    </div>
  )}

  {/* 💬 WHATSAPP DIRECT CHAT */}
  {company.contact_phone && (
    <div className="info-item animate-fade-in-item delay-3">
      <span className="icon">💬</span>
      <div>
        <strong>WhatsApp</strong>
        <p>
          <a
            href={`https://wa.me/${company.contact_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
              "Hello, I am contacting you from your website."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Chat on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )}

  {/* 👥 WHATSAPP GROUP JOIN (OPTIONAL) */}
  {company.whatsapp_group_link && (
    <div className="info-item animate-fade-in-item delay-4">
      <span className="icon">👥</span>
      <div>
        <strong>Community</strong>
        <p>
          <a
            href={company.whatsapp_group_link}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Join WhatsApp Group
          </a>
        </p>
      </div>
    </div>
  )}

</div>








            </div>
          </div>

          {/* DYNAMIC MAP */}
        

{/* DYNAMIC MAP */}
<div className="map-container animate-slide-left">
  {company?.google_map_link ? (
    <iframe
      title="Company Location"
      src={company.google_map_link}
      className="dynamic-map"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  ) : (
    <div className="map-placeholder animate-pulse">
      <span>📍</span>
      <p>Location map coming soon</p>
    </div>
  )}
</div>






        </div>
      </section>
    </>
  );
}

export default AboutCompany;