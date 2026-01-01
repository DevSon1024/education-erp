import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent } from '../../features/student/studentSlice';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    // In a real app, you would collect data from both steps. 
    // For now, we submit directly or handle local state merging.
    console.log(data);
    dispatch(registerStudent({
        ...data,
        course: "659d...dummyID", // Replace with real course selection logic
        batch: "Morning Batch"
    })).then((res) => {
        if (!res.error) navigate('/master/student');
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">New Student Admission</h1>
        <p className="text-gray-500">Complete the steps to register a student.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
        <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
        <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
        
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input {...register('name', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
                {errors.name && <span className="text-red-500 text-xs">Required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input {...register('phone', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input {...register('fatherName')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700">Gender</label>
                 <select {...register('gender')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                    <option>Male</option>
                    <option>Female</option>
                 </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
                <button type="button" onClick={() => setStep(2)} className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-800 flex items-center">
                    Next <ChevronRight size={16} className="ml-2"/>
                </button>
            </div>
          </div>
        )}

        {/* Step 2: Course Details */}
        {step === 2 && (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Academic Details</h2>
                {/* Add Course Dropdown here in real implementation */}
                <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded">
                    Note: Course & Batch selection would go here.
                </div>
                
                <div className="flex justify-between mt-6">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium">Back</button>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center">
                        Submit Admission <Check size={16} className="ml-2"/>
                    </button>
                </div>
            </div>
        )}
      </form>
    </div>
  );
};

export default StudentRegistration;