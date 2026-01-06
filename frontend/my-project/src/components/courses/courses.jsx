import React, { useEffect, useState } from "react";
import api from "../apis/api"
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
 import Navbar from "../navabar/navbar";
 import CourseWithSyllabusForm from "./create_course";
import "./courses.css";



const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    const { token, logout } = useContext(AuthContext);

  
  


  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        logout();
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/VJISS/course_details/");
        setCourses(response.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          window.location.href = "/login";
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, logout]);



//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await fetch(
//           "http://127.0.0.1:8000/VJISS/course_details/"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch courses");
//         }

//         const data = await response.json();
//         setCourses(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

  if (loading) {
    return <div className="courses-section">Loading courses...</div>;
  }

  if (error) {
    return <div className="courses-section">Error: {error}</div>;
  }

  return (
    <div>
        <Navbar/>
    <section className="courses-section">
      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No courses available</p>
        ) : (
          courses.map((course) => (
            <div className="course-card" key={course.course_id}>
              
              {/* Course Logo */}
              <img
                src={course.course_logo}
                alt={course.course_name}
                className="course-logo"
              />

              <div className="course-header">
                <h3>{course.course_name}</h3>
                <span className={`level-badge ${course.course_level.toLowerCase()}`}>
                  {course.course_level}
                </span>
              </div>
                 <div className="course-meta">
                <span className="course-duration">
  ⏱ <strong>{course.course_duration}</strong>
  <span className="duration-text"> MONTHS</span>
</span>

                {/* <span>💰 ₹{course.course_fee}</span> */}
              </div>
              <p className="course-description">
                {course.course_description}
              </p>

             

              <div className="course-actions">
                <button className="enroll-btn">Enroll Now</button>
                <button className="details-btn">View Details</button>
              </div>

            </div>
          ))
        )}
      </div>
    </section>
    <CourseWithSyllabusForm/>
    </div>
  );
};

export default Courses;














































