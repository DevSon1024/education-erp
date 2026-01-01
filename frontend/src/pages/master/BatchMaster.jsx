import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatches, createBatch, resetMasterStatus } from '../../features/master/masterSlice';
import SmartTable from '../../components/ui/SmartTable';
import { toast } from 'react-toastify';
import { Clock } from 'lucide-react';

const BatchMaster = () => {
  const dispatch = useDispatch();
  const { batches, isSuccess, message } = useSelector((state) => state.master);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { dispatch(fetchBatches()); }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
        toast.success(message);
        dispatch(resetMasterStatus());
        reset();
    }
  }, [isSuccess, message, dispatch, reset]);

  const onSubmit = (data) => {
    dispatch(createBatch(data));
  };

  const columns = [
    { header: 'Batch Name', accessor: 'name' },
    { header: 'Time Slot', accessor: 'time' },
    { header: 'Status', render: (row) => row.isActive ? <span className="text-green-600 font-bold text-xs">Active</span> : <span className="text-red-500 text-xs">Inactive</span> },
  ];

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-orange-500"/> Add Batch
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Name</label>
                    <input {...register('name', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: Morning A" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                    <input {...register('time', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: 09:00 AM - 11:00 AM" />
                </div>
                <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">Save Batch</button>
            </form>
        </div>
      </div>

      <div className="md:col-span-2">
         <SmartTable columns={columns} data={batches} />
      </div>
    </div>
  );
};

export default BatchMaster;