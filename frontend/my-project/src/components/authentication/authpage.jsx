import React, { useState,useRef } from "react";
import axios from "axios";
import {AuthContext} from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./authpage.css";




const PasswordInput = ({
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-field">
      <i className="fas fa-lock"></i>

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />

      <i
        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
        onClick={() => setShowPassword(!showPassword)}
        id="eye-icon"
      ></i>
    </div>
  );
};














const AuthPage = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loader, setLoader] = useState(false);
const [showForgot, setShowForgot] = useState(false);
const [forgotValue, setForgotValue] = useState("");
const[newPassword,setnewPassword]=useState("")
const [confirmPassword,setConfirmPassword]=useState("")
const {login,logout} = React.useContext(AuthContext);

const [otpSent, setOtpSent] = useState(false);
const [checkingUser, setCheckingUser] = useState(false);

const [signupOtpSent, setSignupOtpSent] = useState(false);





const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes

const [otpExpired, setOtpExpired] = useState(false);
const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
const [resendDisabled, setResendDisabled] = useState(false);

const timerRef = useRef(null);






  // ✅ Backend-aligned state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "Male",
    date_of_birth: "",
    password: "",
  });





const sendSignupOtp = async () => {
  if (!formData.email) {
    alert("Please enter email");
    return;
  }

  try {
    await axios.post("http://127.0.0.1:8000/VJISS/send-otp/", {
      email: formData.email,
    });

    alert("OTP sent successfully");

    setSignupOtpSent(true);
    setOtp("");
    startOtpCountdown();
  } catch (err) {
    alert("Failed to send OTP");
  }
};




// const sendForgotOtp = async () => {
//   if (!forgotValue) {
//     alert("Enter email or phone");
//     return;
//   }
//   // call forgot OTP API
//   startOtpCountdown();
// };





const startOtpCountdown = () => {
  clearInterval(timerRef.current);

  setOtpExpired(false);
  setTimeLeft(OTP_EXPIRY_SECONDS);
  setResendDisabled(true);

  timerRef.current = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        setOtpExpired(true);
        setResendDisabled(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};




const sendOtp = async () => {
  if (!forgotValue) {
    alert("Please enter email");
    return;
  }

  setCheckingUser(true);
  try {
    await axios.post("http://127.0.0.1:8000/VJISS/send-otp/", {
      email: forgotValue,
    });

    alert("OTP sent successfully");

    setOtpSent(true);
    
    setOtp("");
    startOtpCountdown();
  } catch (err) {
    alert(err.response?.data?.error || "User not found");
  } finally {
    setCheckingUser(false);
  }
};





const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

 


 const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ================= LOGIN =================
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/VJISS/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );
console.log("Login response:", response.data);

console.log("Received token:", response.data.token);
      login(response.data.token, response.data.is_superuser,response.data.is_staff,response.data.public_id);
      
      alert("Login successful");
      setTimeout(() => {
        
navigate("/");

        
      }, 1000);
    } catch (err) {
      alert("Login failed: Invalid credentials");
    } finally {
      setLoader(false);
    }
  };

const goBackToLogin = () => {
  clearInterval(timerRef.current);
  setShowForgot(false);
  setOtpSent(false);
  setOtp("");
  setOtpExpired(false);
  setTimeLeft(OTP_EXPIRY_SECONDS);
  setResendDisabled(false);
};


const updatepassword = async () => {
  if (otpExpired) {
    alert("OTP expired. Please resend OTP.");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await axios.put("http://127.0.0.1:8000/VJISS/update_password/", {
      email: forgotValue,
      new_password: newPassword,
      otp: otp,
    });

    alert("Password updated successfully");

    clearInterval(timerRef.current);
    setShowForgot(false);
    setForgotValue("");
    setOtp("");
    setnewPassword("");
    setConfirmPassword("");
  } catch (err) {
    alert("Invalid OTP or error updating password");
  }
};


    // ================= SIGN UP =================



const handleSignUpSubmit = async (e) => {
  e.preventDefault();

  if (!signupOtpSent) {
    alert("Please send OTP first");
    return;
  }

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  if (otpExpired) {
    alert("OTP expired. Please resend OTP");
    return;
  }

  try {
    await axios.post(
      "http://127.0.0.1:8000/VJISS/create_user/",
      { ...formData, otp:otp }
    );

    alert("Registration successful!");
    clearInterval(timerRef.current);
    setIsSignUpMode(false);
  } catch(e) {
    console.error("Signup failed", e.response?.data || e.message);
  alert(e.response?.data?.error || "Signup failed. Please try again.");
  }
};



  return (
    <>
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">

          {/* ========== SIGN IN ========== */}
          <form onSubmit={handleSignInSubmit} className="sign-in-form">
  <h2 className="title">Sign in</h2>

  {!showForgot ? (
    <>
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div> */}


<PasswordInput
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  required
/>




      {/* 🔹 Forgot password link */}
    <p
  style={{ cursor: "pointer", color: "#5995fd", fontSize: "14px" }}
  onClick={() => {
    clearInterval(timerRef.current);
    setShowForgot(true);
    setOtp("");
    setSignupOtpSent(false);
    setOtpSent(false);
    setOtpExpired(false);
  }}
>
  Forgot password?
</p>


      <input
        type="submit"
        value={loader ? "..." : "Login"}
        className="btn solid"
        disabled={loader}
      />
    </>
  ) : (
    <>
      {/* 🔹 FORGOT PASSWORD VIEW */}


      {/* 🔹 FORGOT PASSWORD VIEW */}
<div className="input-field">
  <i className="fas fa-user"></i>
  <input
    type="text"
    placeholder="Enter Email or Phone Number"
    value={forgotValue}
    onChange={(e) => setForgotValue(e.target.value)}
    required
  />
</div>

{/* SEND OTP BUTTON */}
{!otpSent && (
  <button
    type="button"
    className="btn solid"
    onClick={sendOtp}
    disabled={checkingUser}
  >
    {checkingUser ? "Checking..." : "Send OTP"}
  </button>
)}

{/* OTP + PASSWORD (ONLY AFTER OTP SENT) */}
{otpSent && (
  <>
    <div className="input-field">
      <i className="fas fa-shield-alt"></i>
      <input
        type="number"
        placeholder={otpExpired ? "OTP Expired" : "Enter OTP"}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={otpExpired}
        required
      />
    </div>

    <p style={{ fontSize: "13px", color: otpExpired ? "red" : "#555" }}>
      {otpExpired
        ? "OTP expired"
        : `OTP expires in ${formatTime(timeLeft)}`}
    </p>

    <button
      type="button"
      className="btn solid"
      disabled={resendDisabled}
      onClick={sendOtp}
    >
      {resendDisabled ? "Resend OTP (wait)" : "Resend OTP"}
    </button>

    <PasswordInput
      name="newPassword"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setnewPassword(e.target.value)}
      required
    />

    <PasswordInput
      name="confirmPassword"
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="btn solid"
      onClick={updatepassword}
    >
      Submit
    </button>
  </>
)}

     
      <p
        style={{ cursor: "pointer", color: "#5995fd", fontSize: "14px", marginTop: "10px" }}
        onClick={goBackToLogin}
      >
        Back to Login
      </p>
    </>
  )}
</form>


          {/* ========== SIGN UP ========== */}
          <form onSubmit={handleSignUpSubmit} className="sign-up-form">
            <h2 className="title">Sign up</h2>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
 <div className="input-field">
      <i className="fas fa-shield-alt"></i>
<input
  type="text"
  inputMode="numeric"
  maxLength={6}
  placeholder={ "Enter OTP"}
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  disabled={!signupOtpSent || otpExpired}
/>



</div>

<button
  type="button"
  className="btn solid"
  onClick={sendSignupOtp}
>
  Send OTP
</button>
{signupOtpSent && (
  <p style={{ fontSize: "13px", color: otpExpired ? "red" : "#555" }}>
    {otpExpired
      ? "OTP expired"
      : `OTP expires in ${formatTime(timeLeft)}`}
  </p>
)}


   
            
           
    


            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="number"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>






            {/* Gender */}
           {/* Gender */}
<div className="gender-container">
  

  <label>
    <input
      type="radio"
      name="gender"
      value="Male"
      checked={formData.gender === "Male"}
      onChange={handleChange}
    />
    Male
  </label>

  <label>
    <input
      type="radio"
      name="gender"
      value="Female"
      checked={formData.gender === "Female"}
      onChange={handleChange}
    />
    Female
  </label>

  <label>
    <input
      type="radio"
      name="gender"
      value="Other"   // ✅ EXACT match
      checked={formData.gender === "Other"}
      onChange={handleChange}
    />
    Other
  </label>
</div>


            <div className="input-field">
              <i className="fas fa-calendar-alt"></i>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </div>

          <PasswordInput
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  required
/>


            <input
              type="submit"
              value={loader ? "..." : "Sign up"}
              className="auth-submit"
              disabled={loader}
            />
          </form>
        </div>
      </div>

      {/* PANELS */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
           <h3>New to our VJISS ?</h3>
          <p>
            Discover a world of possibilities! Join us and explore a vibrant
            community where ideas flourish and connections thrive.
          </p>
            <button className="outline-btn blink-border" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <img src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" className="image" alt="" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of Our Valued Members</h3>
          <p>
            Thank you for being part of our community. Your presence enriches our
            shared experiences. Let's continue this journey together!
          </p>
            <button className="outline-btn blink-border" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" className="image" alt="" />
        </div>
      </div>
    </div>
    </>
  );
};

export default AuthPage;



