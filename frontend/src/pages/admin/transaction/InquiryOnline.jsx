import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import { fetchCourses } from '../../../features/master/masterSlice';
import InquiryForm from '../../../components/transaction/InquiryForm';
import SmartTable from '../../../components/ui/SmartTable';
import { Search, RotateCcw, PhoneCall, Globe, X, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

// --- SUB-COMPONENT: Follow Up Form ---
const FollowUpForm = ({ inquiry, onClose, onSave }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onSave({ 
            id: inquiry._id, 
            data: { ...data, status: 'InProgress' } 
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
                    <p><strong>Phone:</strong> {inquiry.contactStudent}</p>
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

const InquiryOnline = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  
  const [showFollowUpModal, setShowFollowUpModal] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
      startDate: '',
      endDate: '',
      status: '',
      studentName: '',
      dateFilterType: 'inquiryDate',
      source: 'Online' // Locked to Online
  });

  useEffect(() => {
    dispatch(fetchInquiries(filters));
    dispatch(fetchCourses()); // Required for InquiryForm dropdowns
  }, [dispatch, filters]);

  useEffect(() => {
      if (isSuccess && message && (showFollowUpModal || editModalData)) {
          toast.success(message); // "Inquiry Updated" or "Follow-up Updated"
          dispatch(resetTransaction());
          setShowFollowUpModal(null);
          setEditModalData(null);
          // Refresh list to show updated status/dates
          dispatch(fetchInquiries(filters));
      }
  }, [isSuccess, message, dispatch, showFollowUpModal, editModalData, filters]);

  const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
      setFilters({ 
          startDate: '', endDate: '', status: '', studentName: '', 
          dateFilterType: 'inquiryDate', source: 'Online' 
      });
  };

  const handleSaveFollowUp = ({ id, data }) => {
      dispatch(updateInquiry({ id, data }));
  };

  const handleSaveInquiry = (data) => {
      if (data._id) {
          dispatch(updateInquiry({ id: data._id, data }));
      }
  };

  // --- Table Columns ---
  const columns = [
      { header: 'Sr No', render: (_, idx) => idx + 1 },
      { header: 'Inquiry', render: (row) => new Date(row.inquiryDate).toLocaleDateString() }, // Inquiry Date
      { header: 'Student', render: (row) => <span className="font-medium text-blue-900">{row.firstName} {row.lastName}</span> },
      { header: 'Contact (Home)', accessor: 'contactHome' },
      { header: 'Contact (Student)', accessor: 'contactStudent' },
      { header: 'Contact (Parent)', accessor: 'contactParent' },
      { header: 'Gender', accessor: 'gender' },
      { 
          header: 'Status', 
          render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                row.status === 'Open' ? 'bg-green-100 text-green-800' :
                row.status === 'Closed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
            }`}>
                {row.status}
            </span>
          )
      },
      { 
          header: 'Follow-up', 
          render: (row) => row.followUpDate ? new Date(row.followUpDate).toLocaleDateString() : '-' 
      },
      { 
          header: 'Follow-up Time', 
          render: (row) => row.followUpDate ? new Date(row.followUpDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-' 
      },
      { header: 'Follow-Up Details', accessor: 'followUpDetails' },
      { 
          header: 'Follow Up', 
          render: (row) => (
             <button 
                onClick={() => setShowFollowUpModal(row)}
                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-1.5 rounded transition-colors border border-indigo-200"
                title="Add Follow Up"
             >
                <PhoneCall size={16}/>
             </button>
          )
      },
      { header: 'Allocation To', render: (row) => row.allocatedTo?.name || 'Unallocated' }
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-2 rounded-lg"><Globe className="text-blue-600" size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Online Inquiries</h2>
            <p className="text-xs text-gray-500">Manage inquiries received from Website or Social Media</p>
          </div>
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Inquiry Type</label>
                <select name="dateFilterType" onChange={handleFilterChange} value={filters.dateFilterType} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none">
                    <option value="inquiryDate">Inquiry Date</option>
                    <option value="followUpDate">Follow-up Date</option>
                    <option value="createdAt">Allocation Date</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                <input type="date" name="startDate" onChange={handleFilterChange} value={filters.startDate} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                <input type="date" name="endDate" onChange={handleFilterChange} value={filters.endDate} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select name="status" onChange={handleFilterChange} value={filters.status} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none">
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Search Student</label>
                <input type="text" name="studentName" onChange={handleFilterChange} value={filters.studentName} placeholder="Name..." className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div className="flex gap-2">
                <button onClick={() => dispatch(fetchInquiries(filters))} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2">
                    <Search size={16}/> Search
                </button>
                <button onClick={handleResetFilters} className="bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200 transition" title="Reset Filters">
                    <RotateCcw size={18}/>
                </button>
            </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <SmartTable 
        columns={columns}
        data={inquiries}
        pagination={{ page: 1, pages: 1 }} 
        onPageChange={() => {}}
        onEdit={(row) => setEditModalData(row)}
        onDelete={(id) => {
             if(confirm("Are you sure you want to delete this inquiry?")) {
                 dispatch(updateInquiry({ id, data: { isDeleted: true } })).then(() => dispatch(fetchInquiries(filters)));
             }
        }}
      />

      {/* Follow Up Modal */}
      {showFollowUpModal && (
        <FollowUpForm 
            inquiry={showFollowUpModal} 
            onClose={() => setShowFollowUpModal(null)}
            onSave={handleSaveFollowUp}
        />
      )}

      {/* Edit Inquiry Mdoal */}
      {editModalData && (
        <InquiryForm
            mode="Online"
            initialData={editModalData}
            onClose={() => setEditModalData(null)}
            onSave={handleSaveInquiry}
        />
      )}
    </div>
  );
};

export default InquiryOnline;