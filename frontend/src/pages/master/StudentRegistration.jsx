import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent, resetStatus } from '../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../features/master/masterSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, ChevronRight, ChevronLeft, User, BookOpen } from 'lucide-react';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [selectedCourseFees, setSelectedCourseFees] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux State
  const { isSuccess, message, isLoading } = useSelector((state) => state.students);
  const { courses, batches } = useSelector((state) => state.master);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  // Watch course selection to update fees dynamically
  const selectedCourseId = watch('course');

  // Initial Fetch & Side Effects
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourseId) {
        const course = courses.find(c => c._id === selectedCourseId);
        if (course) setSelectedCourseFees(course.fees);
    }
  }, [selectedCourseId, courses]);

  useEffect(() => {
    if (isSuccess) {
        toast.success(message);
        dispatch(resetStatus());
        navigate('/master/student');
    }
  }, [isSuccess, message, dispatch, navigate]);

  const onSubmit = (data) => {
    dispatch(registerStudent(data));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">New Student Admission</h1>
        <p className="text-gray-500">Complete the steps to register a student.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
        <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative">
        
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <User className="text-primary"/> Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input {...register('name', { required: 'Name is required' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-primary focus:border-primary" placeholder="Prince Chaubey" />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid Phone' } })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="9876543210" />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input {...register('fatherName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">Gender</label>
                 <select {...register('gender')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                 </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" {...register('dob')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea {...register('address')} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" placeholder="Full Address..."></textarea>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
                <button type="button" onClick={() => setStep(2)} className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-800 flex items-center shadow-md transition-all">
                    Next Step <ChevronRight size={18} className="ml-2"/>
                </button>
            </div>
          </div>
        )}

        {/* Step 2: Academic Details */}
        {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BookOpen className="text-primary"/> Academic Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Course *</label>
                        <select 
                            {...register('course', { required: 'Course is required' })} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white focus:ring-primary focus:border-primary"
                        >
                            <option value="">-- Select a Course --</option>
                            {courses && courses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.name} ({course.duration})
                                </option>
                            ))}
                        </select>
                        {errors.course && <span className="text-red-500 text-xs">{errors.course.message}</span>}
                    </div>

                    {/* Batch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Batch *</label>
                        <select 
                            {...register('batch', { required: 'Batch is required' })} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white"
                        >
                            <option value="">-- Select a Batch --</option>
                            {batches && batches.map(batch => (
                                <option key={batch._id} value={batch.name}>
                                    {batch.name} ({batch.time})
                                </option>
                            ))}
                        </select>
                        {errors.batch && <span className="text-red-500 text-xs">{errors.batch.message}</span>}
                    </div>

                    {/* Auto-populated Fees */}
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                        <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide">Course Fees</label>
                        <div className="text-2xl font-bold text-blue-900 mt-1">₹ {selectedCourseFees}</div>
                        <p className="text-xs text-blue-600 mt-1">Total fees for the selected course</p>
                    </div>

                    {/* Registration Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Admission Date</label>
                        <input 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                            {...register('createdAt')} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" 
                        />
                    </div>
                </div>
                
                <div className="flex justify-between mt-8 pt-4 border-t">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium flex items-center px-4 py-2 hover:bg-gray-100 rounded transition-colors">
                        <ChevronLeft size={18} className="mr-2"/> Back
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-8 py-2 rounded shadow-md hover:bg-green-700 flex items-center font-medium transition-all transform active:scale-95">
                        {isLoading ? 'Processing...' : 'Confirm Admission'} <Check size={18} className="ml-2"/>
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
};

export default StudentRegistration;