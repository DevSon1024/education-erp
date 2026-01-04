import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchInquiries, createInquiry, updateInquiry, resetTransaction } from '../../features/transaction/transactionSlice';
import { fetchCourses } from '../../features/master/masterSlice';
import SmartTable from '../../components/ui/SmartTable';
import { 
    Plus, Search, RotateCcw, FileText, X, Phone, User, MapPin, 
    Calendar, BookOpen, Camera, Save, PhoneCall 
} from 'lucide-react';
import { toast } from 'react-toastify';

// --- SUB-COMPONENT: Follow Up Form ---
const FollowUpForm = ({ inquiry, onClose, onSave }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onSave({ 
            id: inquiry._id, 
            data: { ...data, status: 'InProgress' } // Auto set to InProgress on follow up
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <PhoneCall size={20} className="text-blue-600"/> Follow Up
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-red-500"/></button>
                </div>
                <div className="mb-4 text-sm bg-gray-50 p-3 rounded">
                    <p><strong>Student:</strong> {inquiry.firstName} {inquiry.lastName}</p>
                    <p><strong>Phone:</strong> {inquiry.contactStudent || inquiry.contactParent}</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Next Follow-Up Date</label>
                        <input type="date" {...register('followUpDate', {required: true})} className="w-full border p-2 rounded text-sm"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Discussion / Remarks</label>
                        <textarea {...register('followUpDetails', {required: true})} rows="4" className="w-full border p-2 rounded text-sm" placeholder="Conversation details..."></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Update Status</label>
                        <select {...register('status')} className="w-full border p-2 rounded text-sm">
                            <option value="InProgress">In Progress</option>
                            <option value="Recall">Recall</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm shadow hover:bg-blue-700">Save Follow Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const InquiryOffline = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  const { courses } = useSelector((state) => state.master);

  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(null); // Stores inquiry obj
  const [filters, setFilters] = useState({
      startDate: '',
      endDate: '',
      status: '',
      studentName: '',
      dateFilterType: 'inquiryDate'
  });

  // Form for Add Inquiry
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchInquiries(filters));
    dispatch(fetchCourses());
  }, [dispatch, filters]); // Re-fetch when filters change

  useEffect(() => {
      if (isSuccess && message) {
          toast.success(message);
          dispatch(resetTransaction());
          setShowAddModal(false);
          setShowFollowUpModal(null);
          reset();
      }
  }, [isSuccess, message, dispatch, reset]);

  // Handlers
  const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
      setFilters({ startDate: '', endDate: '', status: '', studentName: '', dateFilterType: 'inquiryDate' });
  };

  const handleSaveInquiry = (data) => {
      dispatch(createInquiry(data));
  };

  const handleSaveFollowUp = ({ id, data }) => {
      dispatch(updateInquiry({ id, data }));
  };

  // Table Config
  const columns = [
      { header: 'Sr No', render: (_, idx) => idx + 1 },
      { header: 'Inquiry Date', render: (row) => new Date(row.inquiryDate).toLocaleDateString() },
      { header: 'Student Name', render: (row) => `${row.firstName} ${row.lastName || ''}` },
      { header: 'Contact (Self)', accessor: 'contactStudent' },
      { header: 'Contact (Parent)', accessor: 'contactParent' },
      { header: 'Gender', accessor: 'gender' },
      { 
          header: 'Status', 
          render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.status === 'Open' ? 'bg-green-100 text-green-800' :
                row.status === 'Closed' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
            }`}>
                {row.status}
            </span>
          )
      },
      { header: 'Allocation To', render: (row) => row.allocatedTo?.name || 'Unallocated' },
      { 
          header: 'Follow Up', 
          render: (row) => (
             <button 
                onClick={() => setShowFollowUpModal(row)}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-900 text-xs font-bold border border-purple-200 px-2 py-1 rounded bg-purple-50"
             >
                <PhoneCall size={14}/> Action
             </button>
          )
      }
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fadeIn">
      
      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500">Filter By Date</label>
                <select name="dateFilterType" onChange={handleFilterChange} value={filters.dateFilterType} className="w-full border p-2 rounded text-sm">
                    <option value="inquiryDate">Inquiry Date</option>
                    <option value="followUpDate">Follow-up Date</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">Start Date</label>
                <input type="date" name="startDate" onChange={handleFilterChange} value={filters.startDate} className="w-full border p-2 rounded text-sm"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">End Date</label>
                <input type="date" name="endDate" onChange={handleFilterChange} value={filters.endDate} className="w-full border p-2 rounded text-sm"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">Status</label>
                <select name="status" onChange={handleFilterChange} value={filters.status} className="w-full border p-2 rounded text-sm">
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">Search Student</label>
                <input type="text" name="studentName" onChange={handleFilterChange} value={filters.studentName} placeholder="Name..." className="w-full border p-2 rounded text-sm"/>
            </div>
            <div className="flex gap-2">
                <button onClick={() => dispatch(fetchInquiries(filters))} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"><Search size={18}/></button>
                <button onClick={handleResetFilters} className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"><RotateCcw size={18}/></button>
            </div>
        </div>
      </div>

      {/* --- ACTION BAR --- */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-blue-600"/> Offline Inquiries
        </h2>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-800 flex items-center gap-2"
        >
            <Plus size={18}/> Add New Inquiry
        </button>
      </div>

      {/* --- TABLE --- */}
      <SmartTable 
        columns={columns}
        data={inquiries}
        pagination={{ page: 1, pages: 1 }} // Needs real pagination from backend in future
        onPageChange={() => {}}
        onEdit={(row) => toast.info("Edit feature coming soon")}
        onDelete={(id) => toast.error("Delete restricted")}
      />

      {/* --- ADD NEW INQUIRY MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl m-4 relative">
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-bold text-gray-800">New Offline Inquiry</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(handleSaveInquiry)} className="p-6 space-y-6">
                    {/* Section 1: Basic Details */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2"><User size={16}/> Personal Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Inquiry Date</label>
                                <input type="date" {...register('inquiryDate')} defaultValue={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">First Name *</label>
                                <input {...register('firstName', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="First Name"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Father/Husband Name</label>
                                <input {...register('middleName')} className="w-full border p-2 rounded text-sm" placeholder="Middle Name"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Last Name</label>
                                <input {...register('lastName')} className="w-full border p-2 rounded text-sm" placeholder="Surname"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Email Address</label>
                                <input type="email" {...register('email')} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Gender</label>
                                <select {...register('gender')} className="w-full border p-2 rounded text-sm">
                                    <option>Male</option><option>Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm"/>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contact & Address */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2"><Phone size={16}/> Contact & Location</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Student)</label>
                                <input {...register('contactStudent', {required: true})} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Parent)</label>
                                <input {...register('contactParent')} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Home)</label>
                                <input {...register('contactHome')} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div className="md:col-span-1"></div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <textarea {...register('address')} rows="2" className="w-full border p-2 rounded text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">City</label>
                                <input {...register('city')} defaultValue="Surat" className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">State</label>
                                <select {...register('state')} className="w-full border p-2 rounded text-sm">
                                    <option>Gujarat</option><option>Maharashtra</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Academic & Inquiry */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2"><BookOpen size={16}/> Academic & Interest</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <select {...register('education')} className="w-full border p-2 rounded text-sm">
                                    <option value="">-- Select --</option>
                                    <option>SSC</option><option>HSC</option><option>Graduate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Qualification</label>
                                <input {...register('qualification')} className="w-full border p-2 rounded text-sm" placeholder="e.g. B.Com"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Interested Course</label>
                                <select {...register('interestedCourse')} className="w-full border p-2 rounded text-sm">
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Reference Source</label>
                                <select {...register('source')} className="w-full border p-2 rounded text-sm">
                                    <option>Walk-in</option><option>Social Media</option><option>Reference</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Follow Up & Photo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                             <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2"><Calendar size={16}/> Initial Follow-Up</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Next Follow-Up Date</label>
                                    <input type="date" {...register('followUpDate')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Remarks / Details</label>
                                    <input {...register('followUpDetails')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                             </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2"><Camera size={16}/> Photo</h4>
                            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                <p className="text-xs text-gray-500">Drag & Drop or Click to Upload</p>
                                <input type="file" className="hidden" /> 
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={() => reset()} className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-100">Reset</button>
                        <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2">
                            <Save size={18}/> Save Inquiry
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- FOLLOW UP POPUP --- */}
      {showFollowUpModal && (
        <FollowUpForm 
            inquiry={showFollowUpModal} 
            onClose={() => setShowFollowUpModal(null)}
            onSave={handleSaveFollowUp}
        />
      )}

    </div>
  );
};

export default InquiryOffline;