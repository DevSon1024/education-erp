import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Navbar from './components/layout/Navbar';
import PublicLayout from './components/layout/PublicLayout';
import ScrollToTop from './components/layout/ScrollToTop';

// Pages
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminHome from './pages/admin/AdminHome';
import AboutUsPage from './pages/user/AboutUsPage';
import WhySmartPage from './pages/user/WhySmartPage';
import CoursePage from './pages/user/CoursePage';
import CourseDetailPage from './pages/user/CourseDetailPage';
import FacilitiesPage from './pages/user/FacilitiesPage';
import GalleryPage from './pages/user/GalleryPage';
import FranchisePage from './pages/user/FranchisePage';
import ContactPage from './pages/user/ContactPage';
import BlogPage from './pages/user/BlogPage';
import FeedbackPage from './pages/user/FeedbackPage';

// Master Pages
import StudentList from './pages/admin/master/StudentList';
import StudentAdmission from './pages/admin/master/StudentAdmission';
import StudentUpdate from './pages/admin/master/StudentUpdate';
import StudentProfile from './pages/admin/master/StudentProfile';
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
import PendingAdmissionFees from './pages/admin/transaction/PendingAdmissionFees';
import PendingAdmissionFeePayment from './pages/admin/transaction/PendingAdmissionFeePayment';
import StudentCancellation from './pages/admin/transaction/StudentCancellation';
import PendingStudentRegistration from './pages/admin/transaction/PendingStudentRegistration';
import StudentRegistrationProcess from './pages/admin/transaction/StudentRegistrationProcess';


const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <ScrollToTop />
        <div className={`min-h-screen bg-gray-50 text-gray-900 font-sans ${user ? 'pt-20' : ''}`}>
          {user && <Navbar />}
          <Routes>
            {/* PRIVATE ADMIN ROUTES */}
            <Route path="/home" element={<PrivateRoute><AdminHome /></PrivateRoute>} />

            {/* MASTER ROUTES */}
            <Route path="/master/student" element={<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/master/student/new" element={<PrivateRoute><StudentAdmission /></PrivateRoute>} /> 
            <Route path="/master/student/edit/:id" element={<PrivateRoute><StudentUpdate /></PrivateRoute>} />
            <Route path="/master/student/view/:id" element={<PrivateRoute><StudentProfile /></PrivateRoute>} />
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
            <Route path="/transaction/pending-admission-fees" element={<PrivateRoute><PendingAdmissionFees /></PrivateRoute>} />
            <Route path="/transaction/admission-payment/:id" element={<PrivateRoute><PendingAdmissionFeePayment /></PrivateRoute>} />
            
            {/* Updated Route for Student Registration (Admission) */}
            <Route path="/transaction/student-registration" element={<PrivateRoute><StudentAdmission /></PrivateRoute>} />
            
            <Route path="/transaction/student-cancellation" element={<PrivateRoute><StudentCancellation /></PrivateRoute>} />
            <Route path="/transaction/pending-registration" element={<PrivateRoute><PendingStudentRegistration /></PrivateRoute>} />
            <Route path="/transaction/student-registration-process/:id" element={<PrivateRoute><StudentRegistrationProcess /></PrivateRoute>} />
            
            {/* Added Connect -> Inquiry List route (Aliased to InquiryPage) */}
            <Route path="/connect/inquiry-list" element={<PrivateRoute><InquiryPage /></PrivateRoute>} />



            {/* PUBLIC PAGES */}
            {/* AUTH PAGES (Standalone Layout) */}
            <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />

            {/* PUBLIC PAGES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={user ? <Navigate to="/home" replace /> : <HomePage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/why-smart" element={<WhySmartPage />} />
              <Route path="/course" element={<CoursePage />} />
              <Route path="/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/franchise" element={<FranchisePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;