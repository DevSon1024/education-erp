import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, toggleActiveStatus } from '../../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../../features/master/masterSlice';
import { Link } from 'react-router-dom';
import { Eye, Edit, Printer, FileText, CheckSquare, Square, Search, RefreshCw, Plus } from 'lucide-react';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, pagination, isLoading } = useSelector((state) => state.students);
  const { courses } = useSelector((state) => state.master);
  
  // Filter States - Defaulting isRegistered to 'true'
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    courseId: '',
    studentName: '',
    batch: '',
    pageSize: 10,
    pageNumber: 1,
    isRegistered: 'true' // ONLY Show Registered Students
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches()); 
  }, [dispatch]);

  // Debounce or Effect trigger
  useEffect(() => {
    dispatch(fetchStudents(filters));
  }, [dispatch, filters]); 

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, pageNumber: 1 });
  };

  const resetFilters = () => {
    setFilters({
        fromDate: '', 
        toDate: '', 
        courseId: '', 
        studentName: '', 
        batch: '', 
        pageSize: 10, 
        pageNumber: 1,
        isRegistered: 'true' // Reset back to showing registered only
    });
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
            <Search size={16}/> Search Criteria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
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
            </select>
            <label className="text-sm text-gray-600">entries</label>
        </div>
        <Link to="/master/student/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow text-sm font-medium">
            <Plus size={18}/> New Admission
        </Link>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Reg No</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Enroll No</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Father/Husband</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Mobile</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase">Active</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {students.length > 0 ? students.map((s) => (
                        <tr key={s._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-bold text-blue-800">{s.regNo}</td>
                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.enrollmentNo}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">{s.firstName} {s.lastName}</td>
                            <td className="px-4 py-3 text-gray-500">{s.middleName}</td>
                            <td className="px-4 py-3 text-gray-500">{s.mobileParent}</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{s.course?.name}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button onClick={() => dispatch(toggleActiveStatus(s._id))} className="text-primary hover:scale-110 transition">
                                    {s.isActive ? <CheckSquare className="text-green-600" size={20}/> : <Square className="text-gray-400" size={20}/>}
                                </button>
                            </td>
                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                <button title="View" className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Eye size={18}/></button>
                                <button title="Edit" className="text-orange-500 hover:bg-orange-50 p-1 rounded"><Edit size={18}/></button>
                                <button title="Marksheet" className="text-purple-600 hover:bg-purple-50 p-1 rounded"><FileText size={18}/></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" className="text-center py-8 text-gray-400">No registered students found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
            <span className="text-xs text-gray-500">Showing page {pagination.page} of {pagination.pages} ({pagination.count} records)</span>
            <div className="flex gap-1">
                <button 
                    disabled={pagination.page === 1} 
                    onClick={() => setFilters({...filters, pageNumber: pagination.page - 1})}
                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs"
                >Prev</button>
                <button 
                    disabled={pagination.page === pagination.pages} 
                    onClick={() => setFilters({...filters, pageNumber: pagination.page + 1})}
                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-xs"
                >Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentList;