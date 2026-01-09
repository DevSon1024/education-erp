import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, createInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import { fetchCourses } from '../../../features/master/masterSlice';
import { fetchEmployees } from '../../../features/employee/employeeSlice'; // Import
import SmartTable from '../../../components/ui/SmartTable';
import { toast } from 'react-toastify';
import { PhoneCall } from 'lucide-react';

const InquiryPage = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  const { courses } = useSelector((state) => state.master);
  const { employees } = useSelector((state) => state.employees) || { employees: [] }; // Select Employees
  const { register, handleSubmit, reset, watch } = useForm(); // Added watch

  useEffect(() => { 
      dispatch(fetchInquiries());
      dispatch(fetchCourses());
      dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
      if (isSuccess) {
          toast.success(message);
          dispatch(resetTransaction());
          reset();
      }
  }, [isSuccess, message, dispatch, reset]);

  const onSubmit = (data) => {
      dispatch(createInquiry(data));
  };

  const columns = [
    { header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Interest', render: (row) => row.interestedCourse?.name || 'General' },
    { header: 'Status', render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
            row.status === 'Converted' ? 'bg-green-100 text-green-800' : 
            row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
            {row.status}
        </span>
    )},
  ];

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Form Side */}
      <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-600">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PhoneCall size={20} className="text-purple-600"/> New Inquiry
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <input {...register('name', { required: true })} className="w-full border p-2 rounded" placeholder="Visitor Name" />
                  <input {...register('phone', { required: true })} className="w-full border p-2 rounded" placeholder="Phone Number" />
                  <select {...register('interestedCourse')} className="w-full border p-2 rounded">
                      <option value="">Select Course Interest</option>
                      {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <select {...register('source')} className="w-full border p-2 rounded">
                      <option value="">Select Source</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Reference">Reference</option>
                  </select>
                  
                  {/* Conditional Reference Dropdown */}
                  {watch('source') === 'Reference' && (
                      <select {...register('referenceBy')} className="w-full border p-2 rounded">
                          <option value="">Select Reference Person</option>
                          {employees?.map(emp => (
                              <option key={emp._id} value={emp.name}>{emp.name}</option>
                          ))}
                      </select>
                  )}

                  <textarea {...register('remarks')} className="w-full border p-2 rounded" placeholder="Remarks..."></textarea>
                  <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Save Inquiry</button>
              </form>
          </div>
      </div>

      {/* List Side */}
      <div className="md:col-span-2">
          <SmartTable columns={columns} data={inquiries} />
      </div>
    </div>
  );
};

export default InquiryPage;