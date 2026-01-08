import React, { useEffect, useState } from "react";
import api from "../apis/api";
import Navbar from "../navabar/navbar";
import "./trainers.css";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get("/VJISS/trainer_details/");
        setTrainers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load trainers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <>
      <Navbar />

      <section className="trainers-section">
        <h2 className="trainers-title">
          Meet Our Trainers
          <span className="trainers-underline"></span>
        </h2>

        {loading && <p className="loading">Loading trainers...</p>}

        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div className="trainer-card" key={trainer.trainer_id}>
              <img
                src={
                  trainer.trainer_image.startsWith("http")
                    ? trainer.trainer_image
                    : `http://127.0.0.1:8000${trainer.trainer_image}`
                }
                alt={trainer.trainer_name}
                className="trainer-image"
              />

              <h3 className="trainer-name">{trainer.trainer_name}</h3>
              <p className="trainer-title">{trainer.trainer_title}</p>

              <p className="trainer-bio">
                {trainer.trainer_bio.length > 300
                  ? trainer.trainer_bio.slice(0, 300) + "..."
                  : trainer.trainer_bio}
              </p>
            </div>
          ))}
                  {/* ➕ ADD TRAINER BUTTON */}
<div className="add-trainer-wrapper">
  <button
    className="add-trainer-btn"
    onClick={() => alert("Open Add Trainer Form")}
    title="Add New Trainer"
  >
    +
  </button>
</div>
        </div>


      </section>
    </>
  );
};

export default Trainers;