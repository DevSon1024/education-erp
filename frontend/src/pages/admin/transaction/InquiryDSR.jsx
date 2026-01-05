import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchInquiries, createInquiry, updateInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import { fetchCourses } from '../../../features/master/masterSlice';
import SmartTable from '../../../components/ui/SmartTable';
import InquiryForm from '../../../components/transaction/InquiryForm'; // Imported reusable form
import { 
    Plus, Search, X, PhoneCall, FileText, Edit, Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';

// Reuse the FollowUpModal logic (Could be extracted to a separate file entirely)
const FollowUpModal = ({ inquiry, onClose, onSave }) => {
    const { register, handleSubmit } = useForm({ defaultValues: { status: inquiry.status, followUpDetails: inquiry.followUpDetails } });
    const onSubmit = (data) => {
        const fDate = new Date(`${data.fDate}T${data.fTime}`);
        const vDate = data.vDate ? new Date(`${data.vDate}T${data.vTime}`) : null;
        onSave({ id: inquiry._id, data: { ...data, followUpDate: fDate, nextVisitingDate: vDate } });
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl animate-fadeIn">
                <div className="flex justify-between mb-4 border-b pb-2"><h3 className="font-bold text-blue-800">DSR Follow Up</h3><button onClick={onClose}><X/></button></div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-xs font-bold">Date</label><input type="date" {...register('fDate')} required className="border p-2 rounded w-full text-sm"/></div>
                        <div><label className="text-xs font-bold">Time</label><input type="time" {...register('fTime')} required className="border p-2 rounded w-full text-sm"/></div>
                    </div>
                    <div><label className="text-xs font-bold">Details</label><textarea {...register('followUpDetails')} className="border p-2 rounded w-full text-sm" rows="2"></textarea></div>
                    <div><label className="text-xs font-bold">Status</label><select {...register('status')} className="border p-2 rounded w-full text-sm"><option>InProgress</option><option>Converted</option><option>Closed</option></select></div>
                    <div className="bg-gray-50 p-2 rounded mt-2">
                        <p className="font-bold text-xs mb-1 text-purple-700">Next Visit</p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                             <input type="date" {...register('vDate')} className="border p-2 rounded w-full text-sm"/>
                             <input type="time" {...register('vTime')} className="border p-2 rounded w-full text-sm"/>
                        </div>
                        <input {...register('visitReason')} placeholder="Reason..." className="border p-2 rounded w-full text-sm"/>
                    </div>
                    <button className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700">Save</button>
                </form>
            </div>
        </div>
    );
};

const InquiryDSR = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  
  // Filter defaults to DSR
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '', studentName: '', source: 'DSR' });
  const [modal, setModal] = useState({ type: null, data: null });

  useEffect(() => { dispatch(fetchInquiries(filters)); dispatch(fetchCourses()); }, [dispatch, filters]);
  useEffect(() => { 
      if (isSuccess && message) { 
          toast.success(message); 
          dispatch(resetTransaction()); 
          setModal({type:null}); 
      } 
  }, [isSuccess, message]);

  const handleSave = (data) => {
      if(data._id) dispatch(updateInquiry({ id: data._id, data }));
      else dispatch(createInquiry(data)); // Form already handles source='DSR'
  };

  const handleDelete = (id) => {
      if(window.confirm('Delete this DSR entry?')) dispatch(updateInquiry({ id, data: { isDeleted: true } })).then(() => dispatch(fetchInquiries(filters)));
  };

  const columns = [
      { header: 'Sr', render: (_, i) => i + 1 },
      { header: 'Date', render: r => new Date(r.inquiryDate).toLocaleDateString() },
      { header: 'Student', render: r => <span className="font-bold">{r.firstName} {r.lastName}</span> },
      { header: 'Contact', accessor: 'contactStudent' },
      { header: 'Parent', accessor: 'contactParent' },
      { header: 'Status', render: r => <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.status==='Open'?'bg-green-100 text-green-800':'bg-gray-100'}`}>{r.status}</span> },
      { header: 'Next Follow Up', render: r => r.followUpDate ? new Date(r.followUpDate).toLocaleDateString() : '-' },
      { header: 'Details', accessor: 'followUpDetails' },
      { header: 'Action', render: r => <button onClick={() => setModal({type:'followup', data:r})} className="text-purple-600 border border-purple-200 px-2 py-1 rounded bg-purple-50 text-xs font-bold hover:bg-purple-100"><PhoneCall size={14}/> Update</button>},
      { header: 'Actions', render: r => (
          <div className="flex gap-2">
            <button onClick={() => setModal({type:'form', data:r})}><Edit size={16} className="text-green-600"/></button>
            <button onClick={() => handleDelete(r._id)}><Trash2 size={16} className="text-red-600"/></button>
          </div>
      )}
  ];

  return (
    <div className="container mx-auto p-4 max-w-full animate-fadeIn">
        <div className="flex justify-between mb-4 items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FileText className="text-purple-600"/> DSR Inquiry Report</h2>
            <button onClick={() => setModal({type:'form'})} className="bg-primary text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-blue-800"><Plus size={18}/> New DSR</button>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white p-3 rounded border shadow-sm flex gap-3 mb-4">
             <input type="date" onChange={e => setFilters({...filters, startDate: e.target.value})} className="border p-2 rounded text-sm"/>
             <input type="date" onChange={e => setFilters({...filters, endDate: e.target.value})} className="border p-2 rounded text-sm"/>
             <select onChange={e => setFilters({...filters, status: e.target.value})} className="border p-2 rounded text-sm"><option value="">All Status</option><option>Open</option><option>InProgress</option></select>
             <input placeholder="Search Name..." onChange={e => setFilters({...filters, studentName: e.target.value})} className="border p-2 rounded text-sm flex-grow"/>
             <button onClick={() => dispatch(fetchInquiries(filters))} className="bg-gray-800 text-white px-4 rounded hover:bg-black"><Search size={18}/></button>
        </div>

        <SmartTable columns={columns} data={inquiries} />

        {/* Reusable Form Modal */}
        {modal.type === 'form' && (
            <InquiryForm 
                mode="DSR" 
                initialData={modal.data} 
                onClose={() => setModal({type:null})} 
                onSave={handleSave}
            />
        )}

        {/* Follow Up Modal */}
        {modal.type === 'followup' && <FollowUpModal inquiry={modal.data} onClose={() => setModal({type:null})} onSave={({id, data}) => dispatch(updateInquiry({id, data}))}/>}
    </div>
  );
};

export default InquiryDSR;