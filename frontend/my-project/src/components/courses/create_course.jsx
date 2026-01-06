import React, { useContext, useState } from "react";
import api from '../apis/api'
import {AuthContext} from "../contexts/AuthContext";
import './create_course.css'

function CourseWithSyllabusForm() {
  const [courseData, setCourseData] = useState({
    course_name: "",
    course_logo: null,
    course_duration: "",
    course_fee: "",
    course_description: "",
    course_level: "Beginner",
  });
  const {token}=useContext(AuthContext)

  const [syllabus, setSyllabus] = useState([
    { module: "", description: "" },
  ]);

  // Course input change
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Image change
  const handleImageChange = (e) => {
    setCourseData({ ...courseData, course_logo: e.target.files[0] });
  };

  // Syllabus change
  const handleSyllabusChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSyllabus = [...syllabus];
    updatedSyllabus[index][name] = value;
    setSyllabus(updatedSyllabus);
  };

  // Add new syllabus row
  const addSyllabus = () => {
    setSyllabus([...syllabus, { module: "", description: "" }]);
  };

const removeSyllabus = (index) => {
  setSyllabus(syllabus.filter((_, i) => i !== index));
};



  // Submit form (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ===============================
      // 1️⃣ CREATE COURSE
      // ===============================
      const formData = new FormData();

      Object.keys(courseData).forEach((key) => {
        formData.append(key, courseData[key]);
      });
console.log("Submitting Course Data:", courseData);
console.log("Submitting Syllabus Data:", syllabus);
      const courseResponse = await api.post(
        "/VJISS/add_course/",
        formData);
console.log(courseResponse)
      const courseId = courseResponse.data.course_id;
      console.log("Course Created:", courseId);

      // ===============================
      // 2️⃣ CREATE SYLLABUS (FIXED)
      // ===============================






const filteredSyllabus = syllabus.filter(
      (item) => item.module.trim() !== "" && item.description.trim() !== ""
    );

    if (filteredSyllabus.length === 0) {
      alert("Please add at least one syllabus module");
      return;
    }

    console.log("Submitting Syllabus Data:", filteredSyllabus);



      await api.post(
        "/VJISS/add_syllabus/",
        {
          course_id: courseId,
          syllabus: filteredSyllabus, // ✅ CORRECT
        }
      );

      alert("Course and Syllabus created successfully");

      // Optional reset
      setCourseData({
        course_name: "",
        course_logo: null,
        course_duration: "",
        course_fee: "",
        course_description: "",
        course_level: "Beginner",
      });
      setSyllabus([{ module: "", description: "" }]);

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="course-form-container">
      <h2>Create Course</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Course Fields */}
        <input
          type="text"
          name="course_name"
          placeholder="Course Name"
          onChange={handleCourseChange}
          required
        />

        <input
          type="file"
          name="course_logo"
          onChange={handleImageChange}
          required
        />

        <input
          type="text"
          name="course_duration"
          placeholder="Duration"
          onChange={handleCourseChange}
        />

        <input
          type="number"
          name="course_fee"
          placeholder="Fee"
          onChange={handleCourseChange}
        />

        <textarea
          name="course_description"
          placeholder="Description"
          onChange={handleCourseChange}
        />

        <select name="course_level" onChange={handleCourseChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <hr />

        {/* Syllabus Section */}
        <h3>Syllabus</h3>

       {syllabus.map((item, index) => (
  <div key={index} className="syllabus-row">
    <input
      type="text"
      name="module"
      placeholder="Module Name"
      value={item.module}
      onChange={(e) => handleSyllabusChange(index, e)}
    />

    <textarea
      name="description"
      placeholder="Module Description"
      value={item.description}
      onChange={(e) => handleSyllabusChange(index, e)}
    />

    {/* ❌ Remove Module Button */}
    {syllabus.length > 1 && (
      <button
        type="button"
        className="remove-btn"
        onClick={() => removeSyllabus(index)}
      >
        ✖ Remove
      </button>
    )}
  </div>
))}


        <button type="button" onClick={addSyllabus}>
          + Add Module
        </button>

        <br /><br />

        <button type="submit">Submit Course</button>
      </form>
    </div>
  );
}

export default CourseWithSyllabusForm;
