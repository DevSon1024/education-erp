import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, createCourse, resetMasterStatus } from '../../features/master/masterSlice';
import SmartTable from '../../components/ui/SmartTable';
import { toast } from 'react-toastify';
import { BookOpen } from 'lucide-react';

const CourseMaster = () => {
  const dispatch = useDispatch();
  const { courses, isSuccess, message } = useSelector((state) => state.master);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
        toast.success(message);
        dispatch(resetMasterStatus());
        reset(); // Clear form
    }
  }, [isSuccess, message, dispatch, reset]);

  const onSubmit = (data) => {
    dispatch(createCourse(data));
  };

  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Course Name', accessor: 'name' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Fees', render: (row) => `₹${row.fees}` },
  ];

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Column: Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600"/> Add Course
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Code</label>
                    <input {...register('code', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: ADCA" />
                    {errors.code && <span className="text-red-500 text-xs">Required</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Name</label>
                    <input {...register('name', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: Adv. Diploma..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input {...register('duration', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: 12 Months" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Fees</label>
                    <input type="number" {...register('fees', { required: true })} className="w-full border rounded p-2 mt-1" placeholder="Ex: 15000" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Save Course</button>
            </form>
        </div>
      </div>

      {/* Right Column: List */}
      <div className="md:col-span-2">
         <SmartTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CourseMaster;