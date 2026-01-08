import { useEffect, useState } from "react";
import api from "../apis/api";
import Navbar from "../navabar/navbar";
import "./aboutcompany.css";

function AboutCompany() {
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get("/VJISS/company_info_details/");
        const data = response.data;

        if (Array.isArray(data)) {
          if (data.length === 0) {
            setCompany({});
          } else {
            setCompany(data[0]);
          }
        } else if (data && typeof data === "object") {
          setCompany(data);
        } else {
          setCompany({});
        }
      } catch (err) {
        setError(err.message || "Unable to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  return (
    <>
      {/* ✅ NAVBAR ALWAYS VISIBLE */}
      <Navbar />

      {/* 🔄 LOADING STATE */}
      {loading && (
        <div className="status-container">
          <div className="loader"></div>
          <p>Loading company profile...</p>
        </div>
      )}

      {/* ❌ ERROR STATE */}
      {!loading && error && (
        <div className="status-container error">{error}</div>
      )}

      {/* ✅ MAIN CONTENT */}
      {!loading && !error && (
        <>
          {/* HERO SECTION */}
          <section className="about-hero">
            <div className="hero-container">
              <div className="hero-content">
                {company?.company_logo && (
                  <div className="logo-container">
                    <img
                      src={
                        company.company_logo.startsWith("http")
                          ? company.company_logo
                          : `http://127.0.0.1:8000${company.company_logo}`
                      }
                      alt={company.company_name || "Company Logo"}
                      className="hero-logo"
                    />
                  </div>
                )}

                <div className="hero-text">
                  <h1>{company.company_name || "Company Name"}</h1>
                  <div className="hero-divider"></div>
                  <p>{company.company_description || ""}</p>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT & LOCATION */}
          <section className="contact-section">
            <div className="contact-container">
              <div className="contact-info">
                <h2 className="section-title">Get in Touch</h2>
                <div className="divider accent"></div>

                <div className="contact-grid">
                  {company.offce_address && (
                    <div className="info-item">
                      <span className="icon">📍</span>
                      <div>
                        <strong>Office</strong>
                        <p>{company.offce_address}</p>
                      </div>
                    </div>
                  )}

                  {company.contact_phone && (
                    <div className="info-item">
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

                  {company.contact_email && (
                    <div className="info-item">
                      <span className="icon">✉️</span>
                      <div>
                        <strong>Email</strong>
                        <p>
                          <a
                            href={`mailto:${company.contact_email}`}
                            className="contact-link"
                          >
                            {company.contact_email}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  {company.contact_phone && (
                    <div className="info-item">
                      <span className="icon">💬</span>
                      <div>
                        <strong>WhatsApp</strong>
                        <p>
                          <a
                            href={`https://wa.me/${company.contact_phone.replace(
                              /\D/g,
                              ""
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

                  {company.whatsapp_group_link && (
                    <div className="info-item">
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

              {/* MAP */}
              <div className="map-container">
                {company.google_map_link ? (
                  <iframe
                    title="Company Location"
                    src={company.google_map_link}
                    className="dynamic-map"
                    loading="lazy"
                    style={{ border: 0 }}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="map-placeholder">
                    <span>📍</span>
                    <p>Location map coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default AboutCompany;