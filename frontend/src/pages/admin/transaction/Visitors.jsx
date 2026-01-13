import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, FileText, X, Edit, Trash2, Calendar, Clock, BookOpen, User as UserIcon, ArrowRightCircle } from 'lucide-react';
import visitorService from '../../../services/visitorService';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';

const Visitors = () => {
    const navigate = useNavigate();
    // State
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        search: '',
        limit: 10
    });
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        visitingDate: new Date().toISOString().split('T')[0],
        studentName: '',
        mobileNumber: '',
        reference: '',
        referenceContact: '',
        referenceAddress: '',
        course: '',
        inTime: '',
        outTime: '',
        attendedBy: '',
        remarks: ''
    });

    // Dropdown Data State
    const [courses, setCourses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isNewReference, setIsNewReference] = useState(false);

    // Fetch Initial Data
    useEffect(() => {
        fetchVisitors();
        fetchDropdowns();
    }, []);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const data = await visitorService.getAllVisitors(filters);
            setVisitors(data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        // Replace with actual API endpoints
        try {
            const coursesRes = await axios.get('http://localhost:5000/api/master/course'); 
            // Assuming this route exists based on masterRoutes, if not we might need to adjust
            setCourses(coursesRes.data);

            const empRes = await axios.get('http://localhost:5000/api/employees');
            // Assuming this route exists based on employeeRoutes
            setEmployees(empRes.data);
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchVisitors();
    };

    const handleReset = () => {
        setFilters({
            fromDate: '',
            toDate: '',
            search: '',
            limit: 10
        });
        // fetchVisitors() will be called if we trigger it or use effect dependency, 
        // but let's call it manually to be sure
        setTimeout(fetchVisitors, 100); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setEditMode(false);
        setIsNewReference(false);
        setFormData({
            visitingDate: new Date().toISOString().split('T')[0],
            studentName: '',
            mobileNumber: '',
            reference: '',
            referenceContact: '',
            referenceAddress: '',
            course: '',
            inTime: '',
            outTime: '',
            attendedBy: '',
            remarks: ''
        });
        setShowModal(true);
    };

    const handleEdit = (visitor) => {
        setEditMode(true);
        setCurrentId(visitor._id);
        
        // Determine if reference is likely new/external (basic heuristic: not in employee list logic could be added)
        // For now, if referenceContact exists, assume it was a 'New Reference'
        const isExternal = !!visitor.referenceContact; 
        setIsNewReference(isExternal);

        setFormData({
            visitingDate: visitor.visitingDate ? visitor.visitingDate.split('T')[0] : '',
            studentName: visitor.studentName,
            mobileNumber: visitor.mobileNumber,
            reference: visitor.reference,
            referenceContact: visitor.referenceContact || '',
            referenceAddress: visitor.referenceAddress || '',
            course: visitor.course?._id || visitor.course,
            inTime: visitor.inTime,
            outTime: visitor.outTime,
            attendedBy: visitor.attendedBy?._id || visitor.attendedBy,
            remarks: visitor.remarks
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this visitor?')) {
            try {
                await visitorService.deleteVisitor(id);
                fetchVisitors();
            } catch (error) {
                console.error("Error deleting visitor:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await visitorService.updateVisitor(currentId, formData);
            } else {
                await visitorService.createVisitor(formData);
            }
            setShowModal(false);
            fetchVisitors();
        } catch (error) {
            console.error("Error saving visitor:", error);
            alert("Failed to save visitor");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-600" size={32} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Visitors Log</h2>
                            <p className="text-sm text-gray-500">Manage daily visitors and inquiries</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} /> Add New Visitor
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
                        <input 
                            type="date" 
                            name="fromDate" 
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                        <input 
                            type="date" 
                            name="toDate" 
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Reference / Search</label>
                        <input 
                            type="text" 
                            name="search" 
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Name, Mobile, Ref..."
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                     <div className="flex items-end gap-2">
                        <button 
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 flex-1 justify-center"
                        >
                            <Search size={16} /> Search
                        </button>
                         <button 
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                     <div className="flex items-end">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-700 w-full justify-center">
                            <FileText size={16} /> Report
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <div className="mb-2 flex justify-end">
                         <select 
                            name="limit" 
                            value={filters.limit} 
                            onChange={(e) => { handleFilterChange(e); setTimeout(fetchVisitors, 100); }}
                            className="border rounded p-1 text-sm text-gray-600"
                        >
                            <option value="10">10 Entries</option>
                            <option value="25">25 Entries</option>
                            <option value="50">50 Entries</option>
                            <option value="100">100 Entries</option>
                        </select>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase tracking-wider">
                                <th className="p-3 border-b">Sr No.</th>
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Visitor Name</th>
                                <th className="p-3 border-b">Contact</th>
                                <th className="p-3 border-b">Reference</th>
                                <th className="p-3 border-b">Course</th>
                                <th className="p-3 border-b">In/Out</th>
                                <th className="p-3 border-b">Attended By</th>
                                <th className="p-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="text-center p-4">Loading...</td></tr>
                            ) : visitors.length === 0 ? (
                                <tr><td colSpan="9" className="text-center p-4 text-gray-500">No visitors found.</td></tr>
                            ) : (
                                visitors.map((visitor, index) => (
                                    <tr key={visitor._id} className="hover:bg-gray-50 text-sm border-b">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{formatDate(visitor.visitingDate)}</td>
                                        <td className="p-3 font-medium text-gray-800">{visitor.studentName}</td>
                                        <td className="p-3 text-gray-600">{visitor.mobileNumber}</td>
                                        <td className="p-3">{visitor.reference}</td>
                                        <td className="p-3">{visitor.course?.name || '-'}</td>
                                        <td className="p-3 text-xs">
                                            <div className="text-green-600">In: {visitor.inTime || '-'}</div>
                                            <div className="text-red-500">Out: {visitor.outTime || '-'}</div>
                                        </td>
                                        <td className="p-3">{visitor.attendedBy?.name || visitor.attendedBy?.username || '-'}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                {visitor.inquiryId ? (
                                                     <button 
                                                        disabled
                                                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-green-200 cursor-not-allowed" 
                                                        title="Already Converted"
                                                    >
                                                        <ArrowRightCircle size={14} /> Converted
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => navigate('/transaction/inquiry/offline', { state: { visitorData: visitor } })} 
                                                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold hover:bg-orange-200 flex items-center gap-1 border border-orange-200 transition-colors" 
                                                        title="Convert to Inquiry"
                                                    >
                                                        <ArrowRightCircle size={14} /> Convert
                                                    </button>
                                                )}
                                                <button onClick={() => handleEdit(visitor)} className="text-blue-500 hover:text-blue-700 p-1">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(visitor._id)} className="text-red-500 hover:text-red-700 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {editMode ? 'Edit Visitor' : 'Add New Visitor'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Date</label>
                                    <input 
                                        type="date"
                                        name="visitingDate"
                                        value={formData.visitingDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                                    <input 
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input 
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                                    <div className="flex flex-col gap-2">
                                        <select 
                                            name="reference"
                                            value={isNewReference ? 'new_ref_option' : formData.reference}
                                            onChange={(e) => {
                                                if (e.target.value === 'new_ref_option') {
                                                    setIsNewReference(true);
                                                    setFormData(prev => ({ ...prev, reference: '' }));
                                                } else {
                                                    setIsNewReference(false);
                                                    handleInputChange(e);
                                                }
                                            }}
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select Reference</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp.name || `${emp.firstName} ${emp.lastName}`}>
                                                    {emp.name || `${emp.firstName} ${emp.lastName}`} (Staff)
                                                </option>
                                            ))}
                                            <option value="new_ref_option" className="font-bold text-blue-600">+ Add New Reference</option>
                                        </select>
                                        {isNewReference && (
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-1">
                                                <input 
                                                    type="text" 
                                                    name="reference"
                                                    value={formData.reference}
                                                    onChange={handleInputChange}
                                                    placeholder="Reference Name"
                                                    className="w-full border rounded p-1 mb-2 text-sm"
                                                    required
                                                />
                                                <input 
                                                    type="tel" 
                                                    name="referenceContact"
                                                    value={formData.referenceContact}
                                                    onChange={handleInputChange}
                                                    placeholder="Mobile Number"
                                                    className="w-full border rounded p-1 mb-2 text-sm"
                                                />
                                                <input 
                                                    type="text" 
                                                    name="referenceAddress"
                                                    value={formData.referenceAddress}
                                                    onChange={handleInputChange}
                                                    placeholder="Address / Remarks"
                                                    className="w-full border rounded p-1 text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested</label>
                                    <select 
                                        name="course" 
                                        value={formData.course} 
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>{course.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Attended By</label>
                                    <select 
                                        name="attendedBy" 
                                        value={formData.attendedBy} 
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Staff</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name || emp.firstName + ' ' + emp.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">In Time</label>
                                    <input 
                                        type="time" 
                                        name="inTime" 
                                        value={formData.inTime} 
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Out Time</label>
                                    <input 
                                        type="time" 
                                        name="outTime" 
                                        value={formData.outTime} 
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <textarea 
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                                    ></textarea>
                                </div>
                                
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                    >
                                        {editMode ? 'Update Visitor' : 'Save Visitor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Visitors;
