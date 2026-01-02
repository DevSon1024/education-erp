import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/layout/Navbar';
import StudentList from './pages/master/StudentList';
import StudentRegistration from './pages/master/StudentRegistration';
import CourseMaster from './pages/master/CourseMaster';
import BatchMaster from './pages/master/BatchMaster';
import InquiryPage from './pages/transaction/InquiryPage';
import FeeCollection from './pages/transaction/FeeCollection';
import EmployeeMaster from './pages/master/EmployeeMaster';
import SubjectMaster from './pages/master/SubjectMaster';

// Placeholder Dashboard (We will move this to a separate file later)
const Dashboard = () => (
  <div className="container mx-auto p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       {['Total Students', 'New Admissions', 'Fees Collected', 'Pending Enquiries'].map((title, i) => (
         <div key={i} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:shadow-lg transition-shadow">
            <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{Math.floor(Math.random() * 1000) + 100}</p>
         </div>
       ))}
    </div>
  </div>
);

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
            {/* Public Routes */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            
            {/* Private Routes */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            <Route path="/master/student" element=    {<PrivateRoute><StudentList /></PrivateRoute>} />
            <Route path="/master/student/new" element={<PrivateRoute><StudentRegistration /></PrivateRoute>} />

            <Route path="/master/course" element={<PrivateRoute><CourseMaster /></PrivateRoute>} />
            <Route path="/master/batch" element={<PrivateRoute><BatchMaster /></PrivateRoute>} />

            <Route path="/master/employee" element={<PrivateRoute><EmployeeMaster /></PrivateRoute>} />
            <Route path="/master/subject" element={<PrivateRoute><SubjectMaster /></PrivateRoute>} />

            <Route path="/transaction/inquiry" element={<PrivateRoute><InquiryPage /></PrivateRoute>} />
            <Route path="/transaction/fees-receipt" element={<PrivateRoute><FeeCollection /></PrivateRoute>} />

            
            
            {/* Catch all - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;