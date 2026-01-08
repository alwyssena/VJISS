import { Routes, Route, useLocation } from "react-router-dom";
import AuthProvider from "./components/contexts/AuthContext";
import TokenNotifier from "./components/alerts/loginalert";
import Dashboard from "./components/DashBoard/dashboard";
import AuthPage from "./components/authentication/authpage";
import Courses from "./components/courses/courses";
import NavbarProvider from "./components/contexts/navbarContext";
import AboutCompany from "./components/aboutCompany/aboutcompany";
import InternshipOffers from "./components/internships/internships";
import JobNotifications from "./components/jobNotifications/jobnotifications";
import Trainers from "./components/trainers/about_trainers";

function App() {
  const location = useLocation(); // ✅ SAFE now

  return (
    <AuthProvider>
      
      <NavbarProvider>
      {location.pathname !== "/login" && <TokenNotifier />}

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<AboutCompany/>}/>
        <Route path ="/internship" element={<InternshipOffers/>}/>
        <Route path ='/jobnotifications' element={<JobNotifications/>}/>
        <Route path='/trainers' element={<Trainers/>}/>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      </NavbarProvider>
    </AuthProvider>
  );
}

export default App;
