import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent, resetStatus } from '../../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../../features/master/masterSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, ChevronRight, ChevronLeft, Save } from 'lucide-react';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [selectedFees, setSelectedFees] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSuccess } = useSelector((state) => state.students);
  const { courses, batches } = useSelector((state) => state.master);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  // Watchers
  const watchCourse = watch('course');
  const watchPaymentMode = watch('paymentMode');

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches());
  }, [dispatch]);

  // Auto-fill fees based on course
  useEffect(() => {
    if (watchCourse) {
        const course = courses.find(c => c._id === watchCourse);
        if (course) {
            setSelectedFees(course.fees);
            setValue('totalFees', course.fees);
        }
    }
  }, [watchCourse, courses, setValue]);

  useEffect(() => {
    if (isSuccess) {
        toast.success("Student Admitted Successfully!");
        dispatch(resetStatus());
        navigate('/master/student');
    }
  }, [isSuccess, dispatch, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreviewImage(URL.createObjectURL(file));
        // In real app: dispatch upload action here or attach to FormData
        setValue('studentPhoto', file.name); // Mocking path
    }
  };

  const onSubmit = (data) => {
    dispatch(registerStudent(data));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold uppercase tracking-wide">New Student Admission</h1>
            <div className="flex gap-2 text-sm">
                <span className={step === 1 ? "font-bold underline" : "opacity-70"}>1. Personal</span>
                <span>&gt;</span>
                <span className={step === 2 ? "font-bold underline" : "opacity-70"}>2. Course & Payment</span>
                <span>&gt;</span>
                <span className={step === 3 ? "font-bold underline" : "opacity-70"}>3. Review</span>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {/* STEP 1: Student Details */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                    
                    {/* Row 1 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Admission Date *</label>
                        <input type="date" {...register('admissionDate', {required:true})} className="w-full border p-2 rounded text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Aadhar Card No *</label>
                        <input {...register('aadharCard', {required:true})} className="w-full border p-2 rounded text-sm" placeholder="1234-5678-9012"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase">First Name *</label>
                        <input {...register('firstName', {required:true})} className="w-full border p-2 rounded text-sm" placeholder="Student Name"/>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Father/Husband Name *</label>
                        <input {...register('middleName', {required:true})} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Last Name *</label>
                        <input {...register('lastName', {required:true})} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Mother Name</label>
                        <input {...register('motherName')} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase">DOB *</label>
                         <input type="date" {...register('dob', {required:true})} className="w-full border p-2 rounded text-sm" />
                    </div>

                    {/* Row 3 - Contacts */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Mobile (Parent) *</label>
                        <input {...register('mobileParent', {required:true})} className="w-full border p-2 rounded text-sm" placeholder="For SMS Alerts"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Mobile (Student)</label>
                        <input {...register('mobileStudent')} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Email</label>
                        <input type="email" {...register('email')} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Gender *</label>
                        <select {...register('gender', {required:true})} className="w-full border p-2 rounded text-sm">
                            <option>Male</option> <option>Female</option>
                        </select>
                    </div>

                    {/* Row 4 - Occupation & Edu */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Occupation Type</label>
                        <select {...register('occupationType')} className="w-full border p-2 rounded text-sm">
                            <option>Student</option> <option>Service</option> <option>Business</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Occupation Name</label>
                        <input {...register('occupationName')} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase">Qualification</label>
                        <input {...register('education')} className="w-full border p-2 rounded text-sm" placeholder="e.g. 12th Pass, B.Com..."/>
                    </div>

                    {/* Row 5 - Address */}
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-gray-700 uppercase">Full Address *</label>
                        <textarea {...register('address', {required:true})} className="w-full border p-2 rounded text-sm" rows="2"></textarea>
                    </div>

                    {/* Row 6 - Locality */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">State *</label>
                        <input list="states" {...register('state', {required:true})} className="w-full border p-2 rounded text-sm" />
                        <datalist id="states"><option value="Gujarat"/><option value="Maharashtra"/><option value="Delhi"/></datalist>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">City *</label>
                        <input {...register('city', {required:true})} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Pin Code</label>
                        <input {...register('pincode')} className="w-full border p-2 rounded text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Reference *</label>
                        <input list="references" {...register('reference', {required:true})} className="w-full border p-2 rounded text-sm" />
                        <datalist id="references"><option value="Social Media"/><option value="Friend"/><option value="Newspaper"/></datalist>
                    </div>

                    {/* Photo Upload */}
                    <div className="md:col-span-4 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 mt-4">
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="h-32 w-32 object-cover rounded-full border shadow-sm mb-2" />
                        ) : (
                            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center mb-2"><Upload className="text-gray-400"/></div>
                        )}
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                            Upload Photo
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="md:col-span-4 flex justify-end mt-4">
                        <button type="button" onClick={() => setStep(2)} className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-blue-800 flex items-center">
                            Next <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: Course & Payment */}
            {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Course Select */}
                        <div>
                             <label className="block text-xs font-bold text-gray-700 uppercase">Select Course</label>
                             <select {...register('course', {required:true})} className="w-full border p-2 rounded">
                                <option value="">-- Select --</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                             </select>
                        </div>
                         {/* Batch Select */}
                         <div>
                             <label className="block text-xs font-bold text-gray-700 uppercase">Select Batch</label>
                             <input list="batches" {...register('batch', {required:true})} className="w-full border p-2 rounded" placeholder="Type to search..." />
                             <datalist id="batches">
                                {batches.map(b => <option key={b._id} value={b.name} />)}
                             </datalist>
                        </div>
                        {/* Fees Display */}
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <span className="text-xs text-blue-600 font-bold uppercase">Total Fees</span>
                            <div className="text-2xl font-bold text-blue-900">₹ {selectedFees}</div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="block text-sm font-bold text-gray-800 mb-2">Payment Method</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 border p-3 rounded w-full cursor-pointer hover:bg-gray-50">
                                <input type="radio" value="Cash" {...register('paymentMode', {required:true})} /> Cash
                            </label>
                            <label className="flex items-center gap-2 border p-3 rounded w-full cursor-pointer hover:bg-gray-50">
                                <input type="radio" value="Online" {...register('paymentMode', {required:true})} /> Online / UPI
                            </label>
                            <label className="flex items-center gap-2 border p-3 rounded w-full cursor-pointer hover:bg-gray-50">
                                <input type="radio" value="EMI" {...register('paymentMode', {required:true})} /> EMI
                            </label>
                        </div>
                    </div>

                    {/* Conditional Payment Details */}
                    {watchPaymentMode === 'EMI' && (
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 text-sm mb-2">EMI Plan Configuration</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Down Payment Amount" className="border p-2 rounded text-sm bg-white" />
                                <input placeholder="No. of Installments" className="border p-2 rounded text-sm bg-white" />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        <button type="button" onClick={() => setStep(1)} className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center">
                            <ChevronLeft size={16}/> Back
                        </button>
                        <button type="button" onClick={() => setStep(3)} className="bg-primary text-white px-6 py-2 rounded shadow flex items-center">
                            Next <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: Fees & Summary */}
            {step === 3 && (
                <div className="animate-fadeIn">
                    <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Admission Summary</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500">Student Name:</div>
                            <div className="font-bold">{watch('firstName')} {watch('lastName')}</div>
                            
                            <div className="text-gray-500">Course:</div>
                            <div className="font-bold">{courses.find(c => c._id === watchCourse)?.name}</div>
                            
                            <div className="text-gray-500">Total Fees:</div>
                            <div className="font-bold text-green-600">₹ {selectedFees}</div>
                            
                            <div className="text-gray-500">Payment Mode:</div>
                            <div className="font-bold">{watchPaymentMode}</div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="button" onClick={() => setStep(2)} className="border px-4 py-2 rounded hover:bg-gray-100">Back</button>
                        <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded shadow-lg hover:bg-green-700 flex items-center gap-2">
                            <Save size={18}/> Confirm Admission
                        </button>
                    </div>
                </div>
            )}
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;