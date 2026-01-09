import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatches } from '../../../../features/master/masterSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Search, RefreshCw, Plus, CheckSquare, Square } from 'lucide-react';

const StudentAttendance = () => {
    const dispatch = useDispatch();
    const { batches } = useSelector((state) => state.master);

    const [view, setView] = useState('list'); // 'list' or 'add'

    // --- List / Filter State ---
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        batchName: '',
        batchTime: ''
    });
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    // --- Add Form State ---
    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        batchName: '',
        batchTime: ''
    });
    const [studentList, setStudentList] = useState([]); // Students to mark attendance for
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchBatches());
    }, [dispatch]);

    // Derived unique batch times for dropdowns
    const uniqueTimes = [...new Set(batches.map(b => `${b.startTime} to ${b.endTime}`))];

    // --- API Calls ---

    const fetchAttendance = async () => {
        try {
            const { data } = await axios.get('/api/attendance/student', { params: filters });
            setAttendanceRecords(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch attendance records');
        }
    };

    const fetchStudentsForAttendance = async () => {
        if (!form.batchName) return;
        setLoading(true);
        try {
            // Fetch students matching the batch name
            const response = await axios.get('/api/master/student', { 
                params: { batch: form.batchName, isRegistered: true } 
            });
            
            // Handle paginated response structure { students: [], page, pages, count }
            const studentsData = response.data.students || [];

            if (studentsData.length === 0) {
                toast.info('No registered students found in this batch');
                setStudentList([]);
                setLoading(false);
                return;
            }
            
            // Transform for table
            const prepared = studentsData.map(s => ({
                studentId: s._id,
                enrollmentNo: s.enrollmentNo,
                name: `${s.firstName} ${s.lastName}`,
                courseName: s.course?.name || '',
                mobileStudent: s.mobileStudent,
                mobileParent: s.mobileParent,
                isPresent: true, // Default Present
                remarks: '',
                courseId: s.course?._id
            }));
            setStudentList(prepared);
            
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAttendance = async () => {
        if (studentList.length === 0) {
            toast.warning('No students to mark attendance for');
            return;
        }
        try {
            await axios.post('/api/attendance/student', {
                date: form.date,
                batchName: form.batchName,
                batchTime: form.batchTime,
                students: studentList
            });
            toast.success('Attendance Saved Successfully');
            setView('list');
            fetchAttendance(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save attendance');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record permanentely?')) {
            try {
                await axios.delete(`/api/attendance/student/${id}`);
                toast.success('Record Deleted');
                fetchAttendance();
            } catch (error) {
                toast.error('Delete Failed');
            }
        }
    };

    // --- Handlers ---
    
    // Toggle Student Presence in Add Form
    const togglePresence = (index) => {
        const updated = [...studentList];
        updated[index].isPresent = !updated[index].isPresent;
        setStudentList(updated);
    };

    // Update Student Remark in Add Form
    const updateStudentRemark = (index, val) => {
        const updated = [...studentList];
        updated[index].remarks = val;
        setStudentList(updated);
    };

    // --- Render Helpers ---

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Student Attendance Manager</h1>
                {view === 'list' && (
                    <button 
                        onClick={() => setView('add')}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                    >
                        <Plus size={18} /> Add New Attendance
                    </button>
                )}
                {view === 'add' && (
                    <button 
                        onClick={() => setView('list')}
                        className="text-gray-600 hover:text-gray-800 underline"
                    >
                        Cancel / Back to List
                    </button>
                )}
            </div>

            {/* --- LIST VIEW --- */}
            {view === 'list' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input 
                                type="date" 
                                className="w-full border rounded-lg p-2"
                                value={filters.fromDate}
                                onChange={e => setFilters({...filters, fromDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input 
                                type="date" 
                                className="w-full border rounded-lg p-2"
                                value={filters.toDate}
                                onChange={e => setFilters({...filters, toDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={filters.batchName}
                                onChange={e => setFilters({...filters, batchName: e.target.value})}
                            >
                                <option value="">All Batches</option>
                                {batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Time</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={filters.batchTime}
                                onChange={e => setFilters({...filters, batchTime: e.target.value})}
                            >
                                <option value="">All Timings</option>
                                {uniqueTimes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={fetchAttendance} className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2">
                                <Search size={18} /> Search
                            </button>
                            <button onClick={() => setFilters({fromDate:'', toDate:'', batchName:'', batchTime:''})} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200">
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Enrollment No</th>
                                    <th className="p-4">Student Name</th>
                                    <th className="p-4">Batch Name</th>
                                    <th className="p-4">Batch Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Remarks</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {attendanceRecords.length > 0 ? (
                                    attendanceRecords.map((record) => (
                                        <tr key={record._id} className="hover:bg-blue-50">
                                            <td className="p-4">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-mono text-xs">{record.student?.enrollmentNo || '-'}</td>
                                            <td className="p-4 font-medium text-gray-800">
                                                {record.student ? `${record.student.firstName} ${record.student.lastName}` : 'N/A'}
                                            </td>
                                            <td className="p-4">{record.batchName}</td>
                                            <td className="p-4 text-sm text-gray-500">{record.batchTime}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${record.isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {record.isPresent ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">{record.remarks || '-'}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDelete(record._id)} className="text-red-500 hover:text-red-700 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-gray-500">No attendance records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- ADD VIEW --- */}
            {view === 'add' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Date</label>
                            <input 
                                type="date" 
                                className="w-full border rounded-lg p-2"
                                value={form.date}
                                onChange={e => setForm({...form, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={form.batchName}
                                onChange={e => {
                                    setForm({...form, batchName: e.target.value});
                                    // Optionally auto-set time or clear list
                                    setStudentList([]); 
                                }}
                            >
                                <option value="">Select Batch</option>
                                {batches.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Time</label>
                            <select 
                                className="w-full border rounded-lg p-2"
                                value={form.batchTime}
                                onChange={e => setForm({...form, batchTime: e.target.value})}
                            >
                                <option value="">Select Time</option>
                                {uniqueTimes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        
                        <div className="flex items-end">
                            <button 
                                onClick={fetchStudentsForAttendance}
                                disabled={!form.batchName || loading}
                                className="w-full bg-accent text-white py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {loading && <RefreshCw size={18} className="animate-spin" />}
                                {loading ? 'Fetching...' : 'Fetch Students'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Student List for Attendance */}
                    {studentList.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-semibold text-gray-700">Mark Attendance</h3>
                                <div className="text-sm text-gray-500">
                                    Total: {studentList.length} | Present: {studentList.filter(s => s.isPresent).length}
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                                    <tr>
                                        <th className="p-4">Enrollment No</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Course</th>
                                        <th className="p-4">Mobile (Stu)</th>
                                        <th className="p-4">Mobile (Par)</th>
                                        <th className="p-4 text-center">Present?</th>
                                        <th className="p-4">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {studentList.map((student, index) => (
                                        <tr key={student.studentId} className={student.isPresent ? 'bg-white' : 'bg-red-50'}>
                                            <td className="p-4 font-mono text-xs">{student.enrollmentNo}</td>
                                            <td className="p-4 font-medium">{student.name}</td>
                                            <td className="p-4 text-sm">{student.courseName}</td>
                                            <td className="p-4 text-sm text-gray-500">{student.mobileStudent}</td>
                                            <td className="p-4 text-sm text-gray-500">{student.mobileParent}</td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => togglePresence(index)}
                                                    className={`p-2 rounded-lg transition-colors ${student.isPresent ? 'text-green-600 bg-green-100' : 'text-red-500 bg-red-100'}`}
                                                >
                                                    {student.isPresent ? <CheckSquare size={24} /> : <Square size={24} />}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <input 
                                                    type="text" 
                                                    className="border rounded p-1 w-full text-sm"
                                                    placeholder="Remarks..."
                                                    value={student.remarks}
                                                    onChange={(e) => updateStudentRemark(index, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={handleSubmitAttendance}
                                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium shadow-lg shadow-green-200"
                                >
                                    Save Attendance
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;
