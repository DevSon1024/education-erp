import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent, fetchStudents, resetStatus } from '../../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../../features/master/masterSlice';
import { fetchInquiries } from '../../../features/transaction/transactionSlice'; // Need to fetch inquiries
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    Upload, ChevronRight, ChevronLeft, Save, 
    Search, AlertCircle, Trash2, Plus, RefreshCw, X
} from 'lucide-react';

// --- MOCK DATA FOR LOCATIONS ---
const STATES = ["Gujarat", "Maharashtra", "Delhi", "Rajasthan"];
const CITIES_BY_STATE = {
    "Gujarat": ["Surat", "Ahmedabad", "Vadodara", "Rajkot"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Delhi": ["New Delhi", "Noida", "Gurgaon"],
    "Rajasthan": ["Jaipur", "Udaipur", "Kota"]
};
// Simple Pincode Map for demo (In real app, use an API)
const PINCODE_MAP = {
    "395006": { city: "Surat", state: "Gujarat" },
    "395001": { city: "Surat", state: "Gujarat" },
    "400001": { city: "Mumbai", state: "Maharashtra" },
    "110001": { city: "New Delhi", state: "Delhi" },
};

const StudentRegistration = () => {
    // --- Redux & Hooks ---
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSuccess, students } = useSelector((state) => state.students);
    const { inquiries } = useSelector((state) => state.transaction);
    const { courses, batches } = useSelector((state) => state.master);

    // --- Local State ---
    const [step, setStep] = useState(1);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewCourses, setPreviewCourses] = useState([]); // List of courses to admit
    const [foundInquiry, setFoundInquiry] = useState(null);
    const [duplicateStudent, setDuplicateStudent] = useState(null);
    const [showAdmissionFeeSection, setShowAdmissionFeeSection] = useState(true); // Default Yes
    const [customQualifications, setCustomQualifications] = useState([]);

    // --- Form Setup ---
    const { 
        register, handleSubmit, watch, setValue, reset, trigger, getValues,
        formState: { errors, isValid } 
    } = useForm({
        defaultValues: {
            admissionDate: new Date().toISOString().split('T')[0],
            paymentMode: 'Cash',
            state: 'Gujarat',
            city: 'Surat'
        }
    });

    // Watchers
    const watchFirstName = watch('firstName');
    const watchLastName = watch('lastName');
    const watchPincode = watch('pincode');
    const watchState = watch('state');
    const watchCourseSelection = watch('selectedCourseId'); // For Radio Button in Table
    const watchPaymentType = watch('paymentType'); // One Time vs Monthly

    // --- 1. INITIALIZATION & CACHING ---

    useEffect(() => {
        // Load initial data
        dispatch(fetchCourses());
        dispatch(fetchBatches());
        dispatch(fetchInquiries({ status: 'Open' })); // Fetch open inquiries for matching
        dispatch(fetchStudents()); // Fetch students for duplicate check

        // Load cached form data
        const savedData = localStorage.getItem('studentRegForm');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Reset form with saved data, but keep some defaults if needed
            reset({ ...parsed, admissionDate: new Date().toISOString().split('T')[0] });
            if (parsed.studentPhotoPreview) setPreviewImage(parsed.studentPhotoPreview);
        }
    }, [dispatch, reset]);

    // Save to LocalStorage on change
    useEffect(() => {
        const subscription = watch((value) => {
            const dataToSave = { ...value, studentPhotoPreview: previewImage };
            localStorage.setItem('studentRegForm', JSON.stringify(dataToSave));
        });
        return () => subscription.unsubscribe();
    }, [watch, previewImage]);

    // Cleanup on Success
    useEffect(() => {
        if (isSuccess) {
            toast.success("Student Admitted Successfully!");
            localStorage.removeItem('studentRegForm');
            dispatch(resetStatus());
            navigate('/master/student');
        }
    }, [isSuccess, dispatch, navigate]);


    // --- 2. INTELLIGENT AUTOFILL & CHECKS ---

    // Pincode Logic
    useEffect(() => {
        if (watchPincode && PINCODE_MAP[watchPincode]) {
            const { city, state } = PINCODE_MAP[watchPincode];
            setValue('state', state);
            setValue('city', city);
        }
    }, [watchPincode, setValue]);

    // Duplicate Student & Inquiry Check
    useEffect(() => {
        if (watchFirstName && watchLastName) {
            // Check Inquiry
            const inquiry = inquiries.find(i => 
                i.firstName?.toLowerCase() === watchFirstName.toLowerCase() && 
                i.lastName?.toLowerCase() === watchLastName.toLowerCase()
            );
            setFoundInquiry(inquiry || null);

            // Check Existing Student
            const student = students.find(s => 
                s.firstName?.toLowerCase() === watchFirstName.toLowerCase() && 
                s.lastName?.toLowerCase() === watchLastName.toLowerCase()
            );
            setDuplicateStudent(student || null);
        }
    }, [watchFirstName, watchLastName, inquiries, students]);

    const handleAutofillInquiry = () => {
        if (foundInquiry) {
            setValue('middleName', foundInquiry.middleName || '');
            setValue('mobileParent', foundInquiry.contactParent || foundInquiry.mobileParent || '');
            setValue('mobileStudent', foundInquiry.contactStudent || foundInquiry.mobileStudent || '');
            setValue('email', foundInquiry.email || '');
            setValue('gender', foundInquiry.gender || 'Male');
            setValue('address', foundInquiry.address || '');
            setValue('state', foundInquiry.state || '');
            setValue('city', foundInquiry.city || '');
            setValue('reference', foundInquiry.source || '');
            toast.info("Details autofilled from Inquiry!");
            setFoundInquiry(null); // Hide alert
        }
    };

    // --- 3. HANDLERS ---

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setValue('studentPhoto', file.name); // Mocking file handling
        }
    };

    const handleAddCourseToList = () => {
        const courseId = getValues('selectedCourseId');
        const batchName = getValues('selectedBatch');
        const startDate = getValues('batchStartDate');
        const paymentType = getValues('paymentType'); // Monthly / One Time

        if (!courseId || !batchName || !startDate) {
            toast.error("Please select Course, Batch and Start Date");
            return;
        }

        const courseObj = courses.find(c => c._id === courseId);
        
        // Check if already added
        if (previewCourses.some(c => c.courseId === courseId)) {
            toast.error("Course already in list!");
            return;
        }

        // Calculate Fees
        let finalFees = courseObj.courseFees;
        let emiDetails = null;

        if (paymentType === 'Monthly') {
            // Mock Calculation for Monthly
            const regFees = courseObj.registrationFees || 1000;
            finalFees = courseObj.courseFees; // Total remains same usually, or adds interest
            const monthlyAmt = Math.round((finalFees - regFees) / (courseObj.duration || 6));
            
            emiDetails = {
                type: 'Monthly',
                registrationFees: regFees,
                monthlyInstallment: monthlyAmt,
                months: courseObj.duration || 6
            };
        }

        const newEntry = {
            id: Date.now(),
            courseId: courseObj._id,
            courseName: courseObj.name,
            batch: batchName,
            startDate: startDate,
            fees: finalFees,
            paymentType,
            emiDetails
        };

        setPreviewCourses([newEntry]); // NOTE: Currently replacing to support single course per student model. Change to [...prev, newEntry] if backend supports array.
        setValue('totalFees', finalFees); // Update main form total
    };

    const handleRemoveCourse = (id) => {
        setPreviewCourses(prev => prev.filter(c => c.id !== id));
    };

    const onSubmit = (data) => {
        if (previewCourses.length === 0) {
            toast.error("Please add at least one course.");
            return;
        }

        // Prepare Payload
        // Note: Backend currently supports single course. We take the first one.
        const primaryCourse = previewCourses[0];

        const payload = {
            ...data,
            course: primaryCourse.courseId,
            batch: primaryCourse.batch,
            totalFees: primaryCourse.fees,
            paymentMode: data.paymentMode, // From Step 3
            pendingFees: showAdmissionFeeSection ? (primaryCourse.fees - (Number(data.amountPaid) || 0)) : primaryCourse.fees,
            // Add custom flag if fees are not paid now
            isAdmissionFeesPaid: showAdmissionFeeSection,
            // Pass EMI details if applicable
            emiDetails: primaryCourse.emiDetails
        };

        dispatch(registerStudent(payload));
    };

    // --- RENDER HELPERS ---

    const renderStepHeader = () => (
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg border">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">1</div>
                <span>Personal</span>
            </div>
            <div className="h-1 flex-1 bg-gray-300 mx-4">
                <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">2</div>
                <span>Course & Batch</span>
            </div>
             <div className="h-1 flex-1 bg-gray-300 mx-4">
                <div className={`h-full bg-primary transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary font-bold' : 'text-gray-400'}`}>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">3</div>
                <span>Fees & Confirm</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] relative">
                
                {/* Cancel Icon */}
                <button onClick={() => navigate('/master/student')} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 z-10">
                    <X size={24} />
                </button>

                <div className="bg-blue-900 text-white p-6">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Student Admission Form</h1>
                    <p className="text-blue-200 text-sm mt-1">Fill all details carefully. Draft is auto-saved.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    {renderStepHeader()}

                    {/* --- ALERTS --- */}
                    {foundInquiry && step === 1 && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6 flex justify-between items-center animate-pulse">
                            <div className="flex items-center gap-3">
                                <Search className="text-green-600" />
                                <div>
                                    <h4 className="font-bold text-green-800">Inquiry Found!</h4>
                                    <p className="text-sm text-green-700">Student <b>{foundInquiry.firstName} {foundInquiry.lastName}</b> found in inquiries.</p>
                                </div>
                            </div>
                            <button type="button" onClick={handleAutofillInquiry} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                                Use Inquiry Data
                            </button>
                        </div>
                    )}

                    {duplicateStudent && step === 1 && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
                            <AlertCircle className="text-red-600" />
                            <div>
                                <h4 className="font-bold text-red-800">Possible Duplicate!</h4>
                                <p className="text-sm text-red-700">A student with this name already exists (ID: {duplicateStudent.enrollmentNo || 'N/A'}).</p>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 1: PERSONAL --- */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
                            
                            {/* Photo Upload Section */}
                            <div className="md:col-span-1">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 h-full">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="h-40 w-40 object-cover rounded-full border-4 border-white shadow-md mb-4" />
                                    ) : (
                                        <div className="h-40 w-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                            <Upload size={40}/>
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow hover:bg-blue-700 transition">
                                        Upload Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>

                            {/* Personal Info Inputs */}
                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Admission Date</label>
                                    <input type="date" {...register('admissionDate', {required: "Required"})} className="input-field" />
                                    {errors.admissionDate && <span className="text-red-500 text-xs">{errors.admissionDate.message}</span>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">First Name *</label>
                                    <input {...register('firstName', {required: "Required"})} className="input-field" placeholder="John" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Last Name *</label>
                                    <input {...register('lastName', {required: "Required"})} className="input-field" placeholder="Doe" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Father/Middle Name</label>
                                    <input {...register('middleName')} className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Mother Name</label>
                                    <input {...register('motherName')} className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date of Birth *</label>
                                    <input type="date" {...register('dob', {required: "Required"})} className="input-field" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Gender *</label>
                                    <select {...register('gender')} className="input-field">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Aadhar Card *</label>
                                    <input {...register('aadharCard', {required: "Required"})} className="input-field" placeholder="XXXX-XXXX-XXXX" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Mobile (Parent) *</label>
                                    <input {...register('mobileParent', {required: "Required", minLength: 10})} className="input-field" placeholder="9876543210" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Mobile (Student)</label>
                                    <input {...register('mobileStudent')} className="input-field" placeholder="Optional" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <input type="email" {...register('email')} className="input-field" placeholder="student@example.com" />
                                </div>
                                
                                {/* Qualification with 'Other' support */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Qualification</label>
                                    <input list="qualifications" {...register('education')} className="input-field" placeholder="Select or Type..." />
                                    <datalist id="qualifications">
                                        <option value="10th Pass"/>
                                        <option value="12th Pass"/>
                                        <option value="Graduate"/>
                                        <option value="Post Graduate"/>
                                        {customQualifications.map((q, i) => <option key={i} value={q}/>)}
                                    </datalist>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Address *</label>
                                    <textarea {...register('address', {required: "Required"})} className="input-field" rows="1"></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode (Auto-fills)</label>
                                    <input {...register('pincode')} className="input-field" placeholder="Enter Pincode" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                    <select {...register('state')} className="input-field">
                                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                    <select {...register('city')} className="input-field">
                                        <option value="">Select City</option>
                                        {watchState && CITIES_BY_STATE[watchState]?.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Reference</label>
                                    <select {...register('reference', {required:true})} className="input-field">
                                        <option>Walk-in</option><option>Friend</option><option>Google</option><option>Social Media</option>
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-4 flex justify-end mt-4">
                                <button type="button" onClick={async () => {
                                    const valid = await trigger();
                                    if(valid) setStep(2);
                                }} className="btn-primary">
                                    Next Step <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2: COURSE & BATCH --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            
                            {/* Course Selection Table */}
                            <div className="bg-white border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase">
                                        <tr>
                                            <th className="p-3">Select</th>
                                            <th className="p-3">Course Name</th>
                                            <th className="p-3">Fees</th>
                                            <th className="p-3">Duration</th>
                                            <th className="p-3">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {courses.map((course) => (
                                            <tr key={course._id} className={`hover:bg-blue-50 cursor-pointer ${watchCourseSelection === course._id ? 'bg-blue-50' : ''}`}
                                                onClick={() => setValue('selectedCourseId', course._id)}>
                                                <td className="p-3">
                                                    <input type="radio" value={course._id} {...register('selectedCourseId')} className="w-4 h-4 text-blue-600" />
                                                </td>
                                                <td className="p-3 font-medium">{course.name}</td>
                                                <td className="p-3">₹ {course.courseFees}</td>
                                                <td className="p-3">{course.duration} {course.durationType}</td>
                                                <td className="p-3">{course.courseType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Batch & Date Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Select Batch</label>
                                    <select {...register('selectedBatch')} className="input-field">
                                        <option value="">-- Choose Batch --</option>
                                        {batches
                                            .filter(b => b.course === watchCourseSelection)
                                            .map(b => <option key={b._id} value={b.name}>{b.name} ({b.startTime} - {b.endTime})</option>)
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Batch Start Date</label>
                                    <input type="date" {...register('batchStartDate')} className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Payment Plan</label>
                                    <select {...register('paymentType')} className="input-field">
                                        <option value="One Time">One Time Payment</option>
                                        <option value="Monthly">Monthly Installments</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button type="button" onClick={handleAddCourseToList} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2">
                                        <Plus size={16}/> Add to Preview
                                    </button>
                                </div>
                            </div>

                            {/* Preview Table */}
                            {previewCourses.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-bold text-gray-800 mb-2">Selected Course Preview</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border">
                                            <thead className="bg-gray-800 text-white">
                                                <tr>
                                                    <th className="p-2">Course</th>
                                                    <th className="p-2">Batch</th>
                                                    <th className="p-2">Start Date</th>
                                                    <th className="p-2">Type</th>
                                                    <th className="p-2">Total Fees</th>
                                                    <th className="p-2">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewCourses.map((item) => (
                                                    <tr key={item.id} className="border-b">
                                                        <td className="p-2">{item.courseName}</td>
                                                        <td className="p-2">{item.batch}</td>
                                                        <td className="p-2">{item.startDate}</td>
                                                        <td className="p-2">{item.paymentType}</td>
                                                        <td className="p-2 font-bold text-green-600">₹ {item.fees}</td>
                                                        <td className="p-2">
                                                            <button onClick={() => handleRemoveCourse(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Monthly Breakdown Display */}
                                    {previewCourses[0]?.paymentType === 'Monthly' && (
                                        <div className="mt-4 bg-yellow-50 p-4 rounded border border-yellow-200">
                                            <h4 className="font-bold text-yellow-800 mb-2">EMI Breakdown:</h4>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>Registration Fees: <b>₹ {previewCourses[0].emiDetails.registrationFees}</b></div>
                                                <div>Installment: <b>₹ {previewCourses[0].emiDetails.monthlyInstallment} / month</b></div>
                                                <div>Duration: <b>{previewCourses[0].emiDetails.months} Months</b></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Logic for Next Step */}
                            <div className="mt-6 border-t pt-4">
                                <label className="font-bold text-gray-700 mr-4">Do you want to add admission fees now?</label>
                                <div className="inline-flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="payFees" checked={showAdmissionFeeSection === true} onChange={() => setShowAdmissionFeeSection(true)} />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="payFees" checked={showAdmissionFeeSection === false} onChange={() => setShowAdmissionFeeSection(false)} />
                                        No (Pay Later)
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary"><ChevronLeft size={16}/> Back</button>
                                {showAdmissionFeeSection ? (
                                    <button type="button" onClick={() => previewCourses.length > 0 ? setStep(3) : toast.error("Add a course first")} className="btn-primary">Next <ChevronRight size={16}/></button>
                                ) : (
                                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                                        <Save size={16}/> Pending Admission
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: FEES --- */}
                    {step === 3 && (
                        <div className="animate-fadeIn max-w-2xl mx-auto">
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Fee Receipt Generation</h3>
                                
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Receipt No</label>
                                        <input className="input-field bg-gray-100" value="AUTO-GEN" disabled />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Receipt Date</label>
                                        <input className="input-field bg-gray-100" value={new Date().toLocaleDateString()} disabled />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Total Payable</label>
                                        <div className="text-2xl font-bold text-blue-600">₹ {previewCourses[0]?.fees}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Amount Paying Now *</label>
                                        <input type="number" {...register('amountPaid', {required:true})} className="input-field border-green-500" placeholder="Enter Amount" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Payment Mode *</label>
                                        <select {...register('paymentMode')} className="input-field">
                                            <option>Cash</option>
                                            <option>Online / UPI</option>
                                            <option>Cheque</option>
                                            <option>Bank Transfer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Remarks</label>
                                        <input {...register('remarks')} className="input-field" placeholder="Optional..." />
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button type="button" onClick={() => reset()} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded flex items-center gap-2">
                                        <RefreshCw size={16}/> Reset
                                    </button>
                                    <button type="button" onClick={() => setStep(2)} className="btn-secondary">Back</button>
                                    <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded shadow-lg hover:bg-green-700 flex items-center gap-2">
                                        <Save size={18}/> Confirm & Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            
            <style>{`
                .input-field { width: 100%; border: 1px solid #d1d5db; padding: 0.5rem; border-radius: 0.375rem; outline: none; transition: border-color 0.2s; }
                .input-field:focus { border-color: #2563eb; ring: 2px; }
                .btn-primary { background-color: #2563eb; color: white; padding: 0.5rem 1.5rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: #1d4ed8; }
                .btn-secondary { border: 1px solid #d1d5db; padding: 0.5rem 1.5rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; }
                .btn-secondary:hover { background-color: #f3f4f6; }
            `}</style>
        </div>
    );
};

export default StudentRegistration;