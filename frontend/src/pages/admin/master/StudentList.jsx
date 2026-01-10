import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, toggleActiveStatus, resetStudentLogin, resetStatus } from '../../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../../features/master/masterSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit, Printer, FileText, CheckSquare, Square, Search, RefreshCw, Plus, Lock, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';

const StudentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, pagination, isLoading, isSuccess, message } = useSelector((state) => state.students);
  const { courses } = useSelector((state) => state.master);
  
  // Filter States
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    courseId: '',
    studentName: '',
    batch: '',
    pageSize: 10,
    pageNumber: 1,
    isRegistered: 'true' 
  });

  // Modal State for Reset Login
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState({ id: null, username: '', password: '' });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches()); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudents(filters));
  }, [dispatch, filters]); 

  useEffect(() => {
      if(isSuccess && message) {
          toast.success(message);
          dispatch(resetStatus());
          if(showResetModal) setShowResetModal(false);
      }
  }, [isSuccess, message, dispatch, showResetModal]);


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, pageNumber: 1 });
  };

  const resetFilters = () => {
    setFilters({
        fromDate: '', toDate: '', courseId: '', studentName: '', batch: '', 
        pageSize: 10, pageNumber: 1, isRegistered: 'true'
    });
  };

  const handleOpenResetModal = (student) => {
      // Pre-fill username if available in student data (needs populate in backend if we want to show current username, 
      // but usually we just allow setting new one. For now empty or student regNo as default)
      setResetData({ 
          id: student._id, 
          username: student.userId?.username || student.regNo || '', 
          password: '' 
      });
      setShowResetModal(true);
  };

  const handleResetSubmit = (e) => {
      e.preventDefault();
      if(resetData.id) {
          dispatch(resetStudentLogin({ 
              id: resetData.id, 
              data: { username: resetData.username, password: resetData.password } 
          }));
      }
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
            <Search size={16}/> Search Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
             {/* ... Filters kept same ... */}
            <div>
                <label className="text-xs text-gray-500">From Date</label>
                <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="w-full border p-1 rounded text-sm"/>
            </div>
            <div>
                <label className="text-xs text-gray-500">To Date</label>
                <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="w-full border p-1 rounded text-sm"/>
            </div>
            <div>
                <label className="text-xs text-gray-500">Course</label>
                <select name="courseId" value={filters.courseId} onChange={handleFilterChange} className="w-full border p-1 rounded text-sm">
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500">Student Name</label>
                <input type="text" name="studentName" value={filters.studentName} onChange={handleFilterChange} className="w-full border p-1 rounded text-sm" placeholder="Search name..."/>
            </div>
            <div>
                <label className="text-xs text-gray-500">Batch</label>
                <input list="batchList" name="batch" value={filters.batch} onChange={handleFilterChange} className="w-full border p-1 rounded text-sm" placeholder="Batch..."/>
                <datalist id="batchList"><option value="Morning"/><option value="Evening"/></datalist>
            </div>
            <div className="flex items-end gap-2">
                <button onClick={resetFilters} className="bg-gray-200 p-2 rounded hover:bg-gray-300 text-gray-700 w-full flex justify-center"><RefreshCw size={18}/></button>
                <button onClick={() => dispatch(fetchStudents(filters))} className="bg-primary text-white p-2 rounded hover:bg-blue-800 w-full flex justify-center">Search</button>
            </div>
        </div>
      </div>

      {/* --- Action Bar --- */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select name="pageSize" value={filters.pageSize} onChange={handleFilterChange} className="border p-1 rounded text-sm">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <label className="text-sm text-gray-600">entries</label>
        </div>
        <Link to="/master/student/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow text-sm font-medium">
            <Plus size={18}/> New Admission
        </Link>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Enroll No</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Reg No</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Name (Father/Husband)</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Mobile</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Course Details</th>
              <th className="px-3 py-3 text-left font-medium text-gray-500 uppercase">Branch</th>
              <th className="px-3 py-3 text-center font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-3 text-right font-medium text-gray-500 uppercase w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.length > 0 ? students.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-gray-700">{s.enrollmentNo}</td>
                <td className="px-3 py-2 text-blue-600 font-mono">{s.regNo || '-'}</td>
                
                <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400">Adm: {moment(s.admissionDate).format('DD/MM/YY')}</span>
                        {s.registrationDate && <span className="text-[10px] text-green-600">Reg: {moment(s.registrationDate).format('DD/MM/YY')}</span>}
                    </div>
                </td>

                <td className="px-3 py-2">
                    <div className="font-medium text-gray-900">{s.firstName} {s.lastName}</div>
                    <div className="text-gray-500 text-[10px]">{s.middleName} ({s.relationType})</div>
                </td>

                <td className="px-3 py-2 text-gray-600">{s.mobileStudent}</td>

                <td className="px-3 py-2">
                    <div className="font-semibold text-blue-800">{s.course?.shortName || s.course?.name}</div>
                    <div className="text-[10px] text-gray-500">{s.course?.duration} {s.course?.durationType}</div>
                </td>

                <td className="px-3 py-2 text-gray-600">{s.branchName}</td>

                <td className="px-3 py-2 text-center">
                    <button onClick={() => dispatch(toggleActiveStatus(s._id))} className="text-primary hover:scale-110 transition" title="Toggle Status">
                        {s.isActive ? <CheckSquare className="text-green-600" size={18}/> : <Square className="text-gray-400" size={18}/>}
                    </button>
                </td>

                <td className="px-3 py-2 text-right">
                   <div className="flex justify-end gap-1">
                        <Link to={`/master/student/view/${s._id}`} className="bg-blue-50 text-blue-600 p-1.5 rounded hover:bg-blue-100 transition" title="View Profile">
                            <Eye size={16}/>
                        </Link>
                        <button onClick={() => handleOpenResetModal(s)} className="bg-yellow-50 text-yellow-600 p-1.5 rounded hover:bg-yellow-100 transition" title="Reset Login">
                            <Lock size={16}/>
                        </button>
                        <Link to={`/master/student/edit/${s._id}`} className="bg-orange-50 text-orange-600 p-1.5 rounded hover:bg-orange-100 transition" title="Edit">
                            <Edit size={16}/>
                        </Link>
                        <Link to={`/master/student/view/${s._id}`} className="bg-purple-50 text-purple-600 p-1.5 rounded hover:bg-purple-100 transition" title="Print Admission Form">
                            <Printer size={16}/>
                        </Link>
                   </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" className="text-center py-8 text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center mt-2 rounded-lg">
          <span className="text-xs text-gray-500">Page {pagination.page} of {pagination.pages} ({pagination.count} records)</span>
          <div className="flex gap-1">
              <button disabled={pagination.page === 1} onClick={() => setFilters({...filters, pageNumber: pagination.page - 1})} className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs">Prev</button>
              <button disabled={pagination.page === pagination.pages} onClick={() => setFilters({...filters, pageNumber: pagination.page + 1})} className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs">Next</button>
          </div>
      </div>

      {/* Reset Login Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Lock className="text-yellow-500"/> Reset Login Details
                </h3>
                
                <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            required
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            value={resetData.username}
                            onChange={(e) => setResetData({...resetData, username: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input 
                            type="text" 
                            placeholder="Leave empty to keep unchanged"
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            value={resetData.password}
                            onChange={(e) => setResetData({...resetData, password: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if you only want to change username.</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                            <Save size={16}/> Update Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default StudentList;