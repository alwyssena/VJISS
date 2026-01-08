import React, { useEffect, useState,useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../apis/api";
import Navbar from "../navabar/navbar";
import "./internships.css";

const InternshipOffers = () => {
  const { token,public_id } = useContext(AuthContext);
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [education, setEducation] = useState("");
  const [resume, setResume] = useState(null);
  console.log("Public ID from context:", public_id);
  const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState({
  internship_id: "",
  internship_name: "",
  internship_description: "",
  technologies: "",
});


  
  // ✅ FETCH DATA
  useEffect(() => {
     console.log("EditData updated:", editData);
    const fetchData = async () => {
      try {
        const appliedRes = await api.get("/VJISS/view_applications/");
        setAppliedInternships(appliedRes.data || []);

        const internshipsRes = await api.get(
          "/VJISS/internship_offers_details/"
        );
        console.log(internshipsRes.data)
        setInternships(Array.isArray(internshipsRes.data) ? internshipsRes.data : []);

     console.log(editData)   
        setInternships(
          Array.isArray(internshipsRes.data) ? internshipsRes.data : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editData]);

  // ✅ CHECK APPLICATION STATUS
  const getApplicationStatus = (internshipId) => {
    return appliedInternships.find(
      (app) => app.internship_offers.internship_id === internshipId
    );
  };

  const openApplyModal = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEducation("");
    setResume(null);
  };

  // ✅ SUBMIT APPLICATION (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!education || !resume) {
      alert("Please select qualification and upload resume");
      return;
    }

    const formData = new FormData();
    formData.append(
      "internship_offers_id",
      selectedInternship.internship_id
    );
    formData.append(
      "student_id",
      public_id
    );
    formData.append("education", education);
    formData.append("resume", resume);
    console.log("Submitting application with data:", {
      internship_offers_id: selectedInternship.internship_id,
      education,
      resume,
    });
    console.log("Public ID being sent:", formData);
    try {
      await api.post("/VJISS/apply_internship/", formData);

      alert("Internship applied successfully!");
      closeModal();

      // 🔄 refresh applied internships
      const updated = await api.get("/VJISS/view_applications/");
      setAppliedInternships(updated.data || []);
    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to apply internship");
    }
  };

const openEditModal = (item) => {
  console.log("Editing item:", item);

  setEditData({
    internship_id: item.internship_id,
    internship_name: item.internship_name,
    internship_description: item.internship_description,
    technologies: item.technologies,
  });

  setShowEditModal(true);
};
const handleDelete = async (item) => {
  if (!window.confirm("Are you sure you want to delete this internship?")) {
    return;
  }

  try {
    await api.delete(`/VJISS/delete_internship_offers/${item.internship_id}`);

    // ✅ REMOVE FROM UI IMMEDIATELY
    setInternships((prev) =>
      prev.filter(
        (internship) =>
          internship.internship_id !== item.internship_id
      )
    );

    alert("Internship deleted successfully!");
  } catch (error) {
    console.error(error.response?.data);
    alert("Failed to delete internship");
  }
};


const handleUpdate = async (e) => {
  e.preventDefault();
  console.log(e)

console.log("data",editData)
  try {
    await api.put(
      `/VJISS/modify_internship_offers/${editData.internship_id}`,
      {
        internship_name: editData.internship_name,
        internship_description: editData.internship_description,
        technologies: editData.technologies,
      }
    );

    alert("Internship updated successfully!");
    setShowEditModal(false);

    // 🔄 refresh internships list
    const res = await api.get("/VJISS/internship_offers_details/");
    setInternships(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error(error.response?.data);
    alert("Failed to update internship");
  }
};



  return (
    <>
      <Navbar />

      <section className="internship-section">
        <h2 className="internship-title">
          Internship Opportunities
          <span className="internship-underline"></span>
        </h2>

        {loading && <p className="loading">Loading internships...</p>}

        <div className="internship-grid">
          {internships.map((item) => {
            const applied = getApplicationStatus(item.internship_id);

            return (
              <div className="internship-card" key={item.internship_id}>
                <h2>{item.internship_name}</h2>
         <p className="description">
  {item.internship_description
    ? item.internship_description.length > 500
      ? item.internship_description.slice(0, 500) + "..."
      : item.internship_description
    : "Description coming soon."}
</p>


                <div className="tech-tags">
                  {item.technologies
                    ?.split(",")
                    .map((t, i) => (
                      <span key={i}>{t.trim()}</span>
                    ))}
                </div>

                {applied ? (
                  <span
                    className={`status-badge ${applied.status.toLowerCase()}`}
                  >
                    {applied.status}
                  </span>
                ) : (
                  <button
                    className="apply-btn"
                    onClick={() => openApplyModal(item)}
                  >
                    Apply Now →
                  </button>
                  
                )}
             <button
  className="modify-btn"
  onClick={() => openEditModal(item)}
>
  Modify ✏️
</button>

              
  <button
    className="delete-btn"
    onClick={() => handleDelete(item)}
  >
    Delete 🗑️
  </button>

              </div>

            );
          })}
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

      {/* ✅ APPLY MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Apply for {selectedInternship.internship_name}</h3>

            <form onSubmit={handleSubmit}>
              <label>Qualification</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Diploma">Diploma</option>
                <option value="UG">Under Graduate</option>
                <option value="PG">Post Graduate</option>
                <option value="PhD">PhD</option>
              </select>

              <label>Upload Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />

              <div className="modal-actions">
                <button type="submit" className="apply-btn">
                  Submit Application
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
        </div>
      )}
      {/* ✏️ MODIFY INTERNSHIP MODAL */}
{showEditModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Modify Internship</h3>

      <form onSubmit={handleUpdate}>
        {/* NAME */}
        <label>Internship Name</label>
        <input
          type="text"
          value={editData.internship_name}
          onChange={(e) =>
            setEditData({
              ...editData,
              internship_name: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          rows="15"
          cols="50"
          value={editData.internship_description}
          onChange={(e) =>
            setEditData({
              ...editData,
              internship_description: e.target.value,
            })
          }
        />

        {/* TECHNOLOGIES */}
        <label>Technologies</label>
        <input
          type="text"
          value={editData.technologies}
          onChange={(e) =>
            setEditData({
              ...editData,
              technologies: e.target.value,
            })
          }
        />

        <div className="modal-actions">
          <button type="submit" className="apply-btn">
            Update
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </>
  );
};

export default InternshipOffers;