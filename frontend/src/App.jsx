import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';

// Pages
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

// Transaction - Inquiry Sub-pages (Create these files)
// import InquiryOnline from './pages/transaction/InquiryOnline';
// import InquiryOffline from './pages/transaction/InquiryOffline';
// import InquiryDSR from './pages/transaction/InquiryDSR';

// Transaction - Visitors Sub-pages (Create these files)
// import TodaysVisitorsList from './pages/transaction/TodaysVisitorsList';
// import TodaysVisitedReport from './pages/transaction/TodaysVisitedReport';
// import Visitors from './pages/transaction/Visitors';

// Transaction - Other Pages (Create these files)
// import StudentAdmissionFees from './pages/transaction/StudentAdmissionFees';
// import StudentCancellation from './pages/transaction/StudentCancellation';

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
          {/* Show Navbar only if logged in */}
          {user && <Navbar />}
          
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            
            {/* ==================== PRIVATE ROUTES ==================== */}
            
            {/* Home */}
            <Route path="/home" element={<PrivateRoute><AdminHome /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><AdminHome /></PrivateRoute>} />

            {/* ==================== MASTER ROUTES ==================== */}
            
            {/* Student */}
            <Route path="/master/student" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/master/student/new" element={<PrivateRoute><StudentRegistration /></PrivateRoute>} />

            {/* Course, Batch, Subject */}
            <Route path="/master/course" element={<PrivateRoute><CourseMaster /></PrivateRoute>} />
            <Route path="/master/batch" element={<PrivateRoute><BatchMaster /></PrivateRoute>} />
            <Route path="/master/subject" element={<PrivateRoute><SubjectMaster /></PrivateRoute>} />

            {/* Employee & User Rights */}
            <Route path="/master/employee" element={<PrivateRoute><EmployeeMaster /></PrivateRoute>} />
            <Route path="/master/user-rights" element={<PrivateRoute><UserRights /></PrivateRoute>} />

            {/* Exam Related */}
            <Route path="/master/exam-request-list" element={<PrivateRoute><ExamRequestList /></PrivateRoute>} />
            <Route path="/master/exam-schedule" element={<PrivateRoute><ExamSchedule /></PrivateRoute>} />
            <Route path="/master/exam-result" element={<PrivateRoute><ExamResult /></PrivateRoute>} />

            {/* ==================== TRANSACTION ROUTES ==================== */}
            
            {/* Legacy/General Inquiry & Fees */}
            {/* <Route path="/transaction/inquiry" element={<PrivateRoute><InquiryPage /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/fees-receipt" element={<PrivateRoute><FeeCollection /></PrivateRoute>} /> */}

            {/* Inquiry Sub-Options */}
            {/* <Route path="/transaction/inquiry/online" element={<PrivateRoute><InquiryOnline /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/inquiry/offline" element={<PrivateRoute><InquiryOffline /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/inquiry/dsr" element={<PrivateRoute><InquiryDSR /></PrivateRoute>} /> */}

            {/* Visitors Sub-Options */}
            {/* <Route path="/transaction/visitors/todays-list" element={<PrivateRoute><TodaysVisitorsList /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/visitors/todays-report" element={<PrivateRoute><TodaysVisitedReport /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/visitors" element={<PrivateRoute><Visitors /></PrivateRoute>} /> */}

            {/* Student Related Transactions */}
            {/* <Route path="/transaction/student-admission-fees" element={<PrivateRoute><StudentAdmissionFees /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/student-registration" element={<PrivateRoute><StudentRegistration /></PrivateRoute>} /> */}
            {/* <Route path="/transaction/student-cancellation" element={<PrivateRoute><StudentCancellation /></PrivateRoute>} /> */}

            {/* ==================== CATCH ALL ==================== */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
