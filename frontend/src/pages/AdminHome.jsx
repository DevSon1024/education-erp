import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries } from '../features/transaction/transactionSlice';
import { fetchPendingExams, fetchCourses } from '../features/master/masterSlice';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, ExternalLink, Clock, AlertCircle } from 'lucide-react';

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Data
  const { inquiries } = useSelector((state) => state.transaction);
  const { pendingExams, courses } = useSelector((state) => state.master);

  // Local State for Tabs
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' or 'exam'

  // Filters for Pending Exams
  const [examFilters, setExamFilters] = useState({
    courseId: '',
    minPendingDays: ''
  });

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchInquiries());
    dispatch(fetchPendingExams());
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleExamFilter = () => {
    dispatch(fetchPendingExams(examFilters));
  };

  const handleResetExamFilter = () => {
    setExamFilters({ courseId: '', minPendingDays: '' });
    dispatch(fetchPendingExams());
  };

  const handleOnlineInquiryAction = (inquiry) => {
    // Navigate to Inquiry Page with some state or ID to process it
    // Assuming /transaction/inquiry exists
    navigate('/transaction/inquiry', { state: { editId: inquiry._id } });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      
      {/* --- Dashboard Header --- */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here is your daily overview.</p>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-full shadow-md inline-flex border">
          <button 
            onClick={() => setActiveTab('inquiry')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              activeTab === 'inquiry' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Inquiry List
          </button>
          <button 
            onClick={() => setActiveTab('exam')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              activeTab === 'exam' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Student Exam Pending List
          </button>
        </div>
      </div>

      {/* --- CONTENT: INQUIRY LIST --- */}
      {activeTab === 'inquiry' && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-blue-500"/> Recent Inquiries
                </h3>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Total: {inquiries?.length || 0}
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Sr No.', 'Contact Date', 'Person', 'Mobile', 'Email', 'City', 'Subject', 'Message', 'Action'].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inquiries && inquiries.length > 0 ? inquiries.map((inq, index) => (
                            <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{new Date(inq.inquiryDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{inq.visitorName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.visitorMobile}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.visitorEmail}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.city}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.inquirySubject}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{inq.message}</td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleOnlineInquiryAction(inq)}
                                        className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                                    >
                                        Add New <ExternalLink size={12}/>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="9" className="text-center py-10 text-gray-500">No recent inquiries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- CONTENT: EXAM PENDING LIST --- */}
      {activeTab === 'exam' && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            {/* Filter Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-wrap gap-4 items-end justify-between">
                    <div>
                         <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                            <Clock size={20} className="text-orange-500"/> Exam Pending List
                        </h3>
                        <p className="text-xs text-gray-500">Students who haven't taken exam after request.</p>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <select 
                            className="border rounded px-3 py-2 text-sm focus:ring-primary"
                            value={examFilters.courseId}
                            onChange={(e) => setExamFilters({...examFilters, courseId: e.target.value})}
                        >
                            <option value="">-- All Courses --</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>

                        <input 
                            type="number" 
                            placeholder="Min Pending Days" 
                            className="border rounded px-3 py-2 text-sm w-40"
                            value={examFilters.minPendingDays}
                            onChange={(e) => setExamFilters({...examFilters, minPendingDays: e.target.value})}
                        />

                        <button onClick={handleResetExamFilter} className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300">
                            <RefreshCw size={18}/>
                        </button>
                        <button onClick={handleExamFilter} className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                            <Search size={16}/> Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-center w-10">
                                <input type="checkbox" className="rounded"/>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sr No.</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Admission Date</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Reg Number</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Pending Days</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-48">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendingExams && pendingExams.length > 0 ? pendingExams.map((exam, index) => (
                            <tr key={exam._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary"/>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {exam.student?.admissionDate ? new Date(exam.student.admissionDate).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-800">{exam.student?.regNo}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                    {exam.student?.firstName} {exam.student?.lastName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {exam.student?.course?.name} ({exam.student?.course?.duration})
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {exam.student?.mobileStudent}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        exam.pendingDays > 30 ? 'bg-red-100 text-red-800' : 
                                        exam.pendingDays > 15 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {exam.pendingDays} Days
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <input 
                                        type="text" 
                                        placeholder="Enter Reason..." 
                                        className="border rounded px-2 py-1 text-xs w-full focus:border-primary outline-none"
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="9" className="text-center py-10 text-gray-500">No pending exams found. Good job!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;