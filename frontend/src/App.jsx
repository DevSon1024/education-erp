import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminHome from './pages/AdminHome';

// Master Pages
import StudentList from './pages/master/StudentList';
import StudentRegistration from './pages/master/StudentRegistration';
import CourseMaster from './pages/master/CourseMaster';
import BatchMaster from './pages/master/BatchMaster';
import EmployeeMaster from './pages/master/EmployeeMaster';
import SubjectMaster from './pages/master/SubjectMaster';
import UserRights from './pages/master/UserRights';
import ExamRequestList from './pages/master/ExamRequestList';
import ExamSchedule from './pages/master/ExamSchedule';
import ExamResult from './pages/master/ExamResult';

// Transaction Pages
import InquiryPage from './pages/transaction/InquiryPage';
import FeeCollection from './pages/transaction/FeeCollection';
import InquiryOnline from './pages/transaction/InquiryOnline';
import InquiryOffline from './pages/transaction/InquiryOffline';
import InquiryDSR from './pages/transaction/InquiryDSR';
import TodaysVisitorsList from './pages/transaction/TodaysVisitorsList';
import TodaysVisitedReport from './pages/transaction/TodaysVisitedReport';
import Visitors from './pages/transaction/Visitors';
import StudentAdmissionFees from './pages/transaction/StudentAdmissionFees';
import StudentCancellation from './pages/transaction/StudentCancellation';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          
          {/* Show Admin Navbar ONLY if user is logged in. 
              Since we redirect logged-in users away from '/', this logic is safe. */}
          {user && <Navbar />}
          
          <Routes>
            {/* PUBLIC LANDING PAGE: If logged in, go to Admin Dashboard */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <HomePage />} />

            {/* AUTH: If logged in, go to Admin Dashboard */}
            <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />
            
            {/* PRIVATE ADMIN ROUTES */}
            <Route path="/home" element={<PrivateRoute><AdminHome /></PrivateRoute>} />

            {/* MASTER ROUTES */}
            <Route path="/master/student" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/master/student/new" element={<PrivateRoute><StudentRegistration /></PrivateRoute>} />
            <Route path="/master/course" element={<PrivateRoute><CourseMaster /></PrivateRoute>} />
            <Route path="/master/batch" element={<PrivateRoute><BatchMaster /></PrivateRoute>} />
            <Route path="/master/subject" element={<PrivateRoute><SubjectMaster /></PrivateRoute>} />
            <Route path="/master/employee" element={<PrivateRoute><EmployeeMaster /></PrivateRoute>} />
            <Route path="/master/user-rights" element={<PrivateRoute><UserRights /></PrivateRoute>} />
            <Route path="/master/exam-request-list" element={<PrivateRoute><ExamRequestList /></PrivateRoute>} />
            <Route path="/master/exam-schedule" element={<PrivateRoute><ExamSchedule /></PrivateRoute>} />
            <Route path="/master/exam-result" element={<PrivateRoute><ExamResult /></PrivateRoute>} />

            {/* TRANSACTION ROUTES */}
            <Route path="/transaction/inquiry" element={<PrivateRoute><InquiryPage /></PrivateRoute>} />
            <Route path="/transaction/fees-receipt" element={<PrivateRoute><FeeCollection /></PrivateRoute>} />
            <Route path="/transaction/inquiry/online" element={<PrivateRoute><InquiryOnline /></PrivateRoute>} />
            <Route path="/transaction/inquiry/offline" element={<PrivateRoute><InquiryOffline /></PrivateRoute>} />
            <Route path="/transaction/inquiry/dsr" element={<PrivateRoute><InquiryDSR /></PrivateRoute>} />
            <Route path="/transaction/visitors/todays-list" element={<PrivateRoute><TodaysVisitorsList /></PrivateRoute>} />
            <Route path="/transaction/visitors/todays-report" element={<PrivateRoute><TodaysVisitedReport /></PrivateRoute>} />
            <Route path="/transaction/visitors" element={<PrivateRoute><Visitors /></PrivateRoute>} />
            <Route path="/transaction/student-admission-fees" element={<PrivateRoute><StudentAdmissionFees /></PrivateRoute>} />
            <Route path="/transaction/student-registration" element={<PrivateRoute><StudentRegistration /></PrivateRoute>} />
            <Route path="/transaction/student-cancellation" element={<PrivateRoute><StudentCancellation /></PrivateRoute>} />

            {/* CATCH ALL */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;