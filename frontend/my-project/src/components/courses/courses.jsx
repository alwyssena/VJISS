import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../navabar/navbar";
import CourseWithSyllabusForm from "./create_course";
import "./courses.css";

/* -------------------------------
   Role Based Action Config
-------------------------------- */
const COURSE_ACTIONS = {
  user: ["enroll", "details"],
  admin: ["enroll", "details", "edit", "delete"],
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token, logout, is_superuser,is_staff } = useContext(AuthContext);
  const navigate = useNavigate();

  const role =
  is_superuser === true
    ? "admin"
    : is_staff === true
    ? "staff"
    : "user";


  /* -------------------------------
     Fetch Courses
  -------------------------------- */
  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        logout();
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/VJISS/course_details/");
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, logout, navigate]);

  /* -------------------------------
     Action Handler (Centralized)
  -------------------------------- */
  const handleAction = (action, courseId) => {
    switch (action) {
      case "enroll":
        console.log("Enroll:", courseId);
        break;

      case "details":
        navigate(`/courses/${courseId}`);
        break;

      case "edit":
        navigate(`/courses/edit/${courseId}`);
        break;

      case "delete":
        if (window.confirm("Are you sure you want to delete this course?")) {
          console.log("Delete:", courseId);
        }
        break;

      default:
        return;
    }
  };

  /* -------------------------------
     UI States
  -------------------------------- */
  if (loading) {
    return <div className="courses-section">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-section error">{error}</div>;
  }

  return (
    <>
      <Navbar />

      <section className="courses-section">
        <div className="courses-grid">
          {courses.length === 0 ? (
            <p>No courses available</p>
          ) : (
            courses.map((course) => (
              <div className="course-card" key={course.course_id}>
                <img
                  src={course.course_logo}
                  alt={course.course_name}
                  className="course-logo"
                />

                <div className="course-header">
                  <h3>{course.course_name}</h3>
                  <span
                    className={`level-badge ${course.course_level.toLowerCase()}`}
                  >
                    {course.course_level}
                  </span>
                </div>

                <div className="course-meta">
                  <span className="course-duration">
                    ⏱ <strong>{course.course_duration}</strong>
                    <span className="duration-text"> MONTHS</span>
                  </span>
                </div>

                <p className="course-description">
                  {course.course_description}
                </p>

                {/* ---------- Actions ---------- */}
                <div
                  className="course-actions"
                  role="group"
                  aria-label="Course actions"
                >
                  {COURSE_ACTIONS[role].map((action) => (
                    <button
                      key={action}
                      type="button"
                      className={`action-btn ${action}`}
                      onClick={() =>
                        handleAction(action, course.course_id)
                      }
                    >
                      {action.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {is_superuser && <CourseWithSyllabusForm />}
    </>
  );
};

export default Courses;
