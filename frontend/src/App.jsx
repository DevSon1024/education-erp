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
import AdminHome from './pages/admin/AdminHome';

// Master Pages
import StudentList from './pages/admin/master/StudentList';
import StudentRegistration from './pages/admin/master/StudentRegistration';
import CourseMaster from './pages/admin/master/CourseMaster';
import BatchMaster from './pages/admin/master/BatchMaster';
import EmployeeMaster from './pages/admin/master/EmployeeMaster';
import SubjectMaster from './pages/admin/master/SubjectMaster';
import UserRights from './pages/admin/master/UserRights';
import ExamRequestList from './pages/admin/master/ExamRequestList';
import ExamSchedule from './pages/admin/master/ExamSchedule';
import ExamResult from './pages/admin/master/ExamResult';

// Transaction Pages
import InquiryPage from './pages/admin/transaction/InquiryPage';
import FeeCollection from './pages/admin/transaction/FeeCollection';
import InquiryOnline from './pages/admin/transaction/InquiryOnline';
import InquiryOffline from './pages/admin/transaction/InquiryOffline';
import InquiryDSR from './pages/admin/transaction/InquiryDSR';
import TodaysVisitorsList from './pages/admin/transaction/TodaysVisitorsList';
import TodaysVisitedReport from './pages/admin/transaction/TodaysVisitedReport';
import Visitors from './pages/admin/transaction/Visitors';
import StudentAdmissionFees from './pages/admin/transaction/StudentAdmissionFees';
import StudentCancellation from './pages/admin/transaction/StudentCancellation';

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