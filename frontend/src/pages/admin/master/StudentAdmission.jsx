import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent, fetchStudents, resetStatus } from '../../../features/student/studentSlice';
import { fetchCourses, fetchBatches } from '../../../features/master/masterSlice';
import { fetchInquiries } from '../../../features/transaction/transactionSlice';
import { fetchEmployees } from '../../../features/employee/employeeSlice'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    Upload, ChevronRight, ChevronLeft, Save, 
    Search, AlertCircle, Trash2, Plus, X, UserCheck
} from 'lucide-react';

const LOCATION_DATA = {
    "Gujarat": ["Surat", "Ahmedabad", "Vadodara", "Rajkot"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Delhi": ["New Delhi", "Noida", "Gurgaon"]
};

const StudentAdmission = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux State
    const { isSuccess, students } = useSelector((state) => state.students);
    const { inquiries } = useSelector((state) => state.transaction);
    const { courses, batches } = useSelector((state) => state.master);
    
    // FIXED: Changed state.employee to state.employees to match store.js
    const { employees } = useSelector((state) => state.employees) || { employees: [] };

    // Local State
    const [step, setStep] = useState(1);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewCourses, setPreviewCourses] = useState([]); 
    const [foundInquiry, setFoundInquiry] = useState(null);
    const [duplicateStudent, setDuplicateStudent] = useState(null);
    const [payAdmissionFee, setPayAdmissionFee] = useState(false);
    const [isNewReference, setIsNewReference] = useState(false);

    // Form Setup
    const { 
        register, handleSubmit, watch, setValue, trigger, getValues,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            admissionDate: new Date().toISOString().split('T')[0],
            state: 'Gujarat',
            city: 'Surat',
            relationType: 'Father',
            receiptDate: new Date().toISOString().split('T')[0]
        }
    });

    const watchFirstName = watch('firstName');
    const watchLastName = watch('lastName');
    const watchCourseSelection = watch('selectedCourseId');
    const watchReference = watch('reference');
    const watchState = watch('state');
    const watchRelation = watch('relationType');

    // --- 1. INITIALIZATION ---
    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchBatches());
        dispatch(fetchInquiries({ status: 'Open' }));
        dispatch(fetchStudents());
        dispatch(fetchEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(payAdmissionFee ? "Student Admitted & Fees Paid!" : "Admission Draft Created!");
            dispatch(resetStatus());
            navigate(payAdmissionFee ? '/transaction/pending-student-registration' : '/transaction/pending-admission-fees');
        }
    }, [isSuccess, dispatch, navigate, payAdmissionFee]);

    // Reference Logic
    useEffect(() => {
        setIsNewReference(watchReference === 'NEW_REF');
    }, [watchReference]);

    // Duplicate & Inquiry Check
    useEffect(() => {
        if (watchFirstName && watchLastName) {
            const inquiry = inquiries.find(i => 
                i.firstName?.toLowerCase() === watchFirstName.toLowerCase() && 
                i.lastName?.toLowerCase() === watchLastName.toLowerCase()
            );
            setFoundInquiry(inquiry || null);

            const student = students.find(s => 
                s.firstName?.toLowerCase() === watchFirstName.toLowerCase() && 
                s.lastName?.toLowerCase() === watchLastName.toLowerCase()
            );
            setDuplicateStudent(student || null);
        }
    }, [watchFirstName, watchLastName, inquiries, students]);

    const handleAutofillInquiry = () => {
        if (foundInquiry) {
            setValue('firstName', foundInquiry.firstName);
            setValue('lastName', foundInquiry.lastName);
            setValue('middleName', foundInquiry.middleName || '');
            setValue('email', foundInquiry.email || '');
            setValue('gender', foundInquiry.gender || 'Male');
            setValue('mobileParent', foundInquiry.contactParent || foundInquiry.mobileParent || '');
            setValue('mobileStudent', foundInquiry.contactStudent || foundInquiry.mobileStudent || '');
            setValue('address', foundInquiry.address || '');
            setValue('state', foundInquiry.state || 'Gujarat');
            setValue('city', foundInquiry.city || 'Surat');
            toast.info("Inquiry Data Autofilled");
            setFoundInquiry(null);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setValue('studentPhoto', file); 
        }
    };

    const handleAddCourseToList = () => {
        const courseId = getValues('selectedCourseId');
        const batchName = getValues('selectedBatch');
        const startDate = getValues('batchStartDate');
        const paymentType = getValues('paymentType');

        if (!courseId || !batchName || !startDate) {
            toast.error("Select Course, Batch and Date");
            return;
        }

        const courseObj = courses.find(c => c._id === courseId);
        const batchObj = batches.find(b => b.name === batchName);

        // Financials
        let finalFees = courseObj.courseFees;
        let emiConfig = null;

        if (paymentType === 'Monthly') {
            const regFees = courseObj.registrationFees || 0;
            const installments = courseObj.totalInstallment || 1;
            const monthlyAmt = Math.ceil((finalFees - regFees) / installments);
            emiConfig = { registrationFees: regFees, monthlyInstallment: monthlyAmt, months: installments };
        }

        const newEntry = {
            id: Date.now(),
            courseId: courseObj._id,
            courseName: courseObj.name,
            batch: batchName,
            batchTime: batchObj ? `${batchObj.startTime} - ${batchObj.endTime}` : 'N/A',
            startDate,
            fees: finalFees,
            admissionFees: courseObj.admissionFees || 0,
            paymentType,
            emiConfig
        };

        setPreviewCourses([newEntry]); 
    };

    const onSubmit = (data) => {
        if (previewCourses.length === 0) {
            toast.error("Please add course details");
            return;
        }

        const courseData = previewCourses[0];
        
        const payload = {
            ...data,
            course: courseData.courseId,
            batch: courseData.batch,
            paymentMode: courseData.paymentType,
            totalFees: courseData.fees,
            
            // Reference Logic
            reference: isNewReference ? 'New Reference' : data.reference,
            referenceDetails: isNewReference ? {
                name: data.refName,
                contact: data.refMobile,
                address: data.refAddress
            } : null,

            // Fee Logic
            isAdmissionFeesPaid: payAdmissionFee,
            pendingFees: payAdmissionFee ? (courseData.fees - (Number(data.amountPaid) || 0)) : courseData.fees,
            
            feeDetails: payAdmissionFee ? {
                amount: Number(data.amountPaid),
                paymentMode: data.receiptPaymentMode,
                remarks: data.remarks,
                date: data.receiptDate
            } : null
        };

        dispatch(registerStudent(payload));
    };

    const renderStepIndicator = () => (
        <div className="flex justify-between items-center mb-8 px-10">
            {[1, 2, 3].map(i => (
                <div key={i} className={`flex flex-col items-center ${step >= i ? 'text-blue-600' : 'text-gray-300'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 
                        ${step >= i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}>
                        {i}
                    </div>
                    <span className="text-xs font-bold mt-1 uppercase">
                        {i === 1 ? "Personal" : i === 2 ? "Course" : "Fees"}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="bg-blue-900 p-4 flex justify-between items-center text-white">
                    <h1 className="text-xl font-bold flex items-center gap-2"><UserCheck/> New Student Admission</h1>
                    <button onClick={() => navigate('/master/student')} className="hover:bg-blue-800 p-1 rounded"><X/></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    {renderStepIndicator()}

                    {/* ALERTS */}
                    {foundInquiry && step === 1 && (
                        <div className="bg-green-50 p-3 mb-4 rounded border border-green-200 flex justify-between items-center animate-pulse">
                            <span className="text-green-800 font-medium flex items-center gap-2">
                                <Search size={16}/> Inquiry found for <b>{foundInquiry.firstName}</b>.
                            </span>
                            <button type="button" onClick={handleAutofillInquiry} className="text-xs bg-green-600 text-white px-3 py-1 rounded">Autofill</button>
                        </div>
                    )}
                    {duplicateStudent && step === 1 && (
                         <div className="bg-red-50 p-3 mb-4 rounded border border-red-200 flex items-center gap-2">
                            <AlertCircle className="text-red-600" size={16}/>
                            <span className="text-red-800 font-medium">Duplicate Student Found (ID: {duplicateStudent.enrollmentNo})</span>
                         </div>
                    )}

                    {/* --- STEP 1: PERSONAL DETAILS --- */}
                    {step === 1 && (
                        <div className="grid grid-cols-12 gap-4 animate-fadeIn">
                            {/* Row 1 */}
                            <div className="col-span-6 md:col-span-4">
                                <label className="label">Admission Date</label>
                                <input type="date" {...register('admissionDate')} className="input" />
                            </div>
                            <div className="col-span-6 md:col-span-4">
                                <label className="label">Aadhar Card *</label>
                                <input {...register('aadharCard', {required:true})} className="input" placeholder="XXXX XXXX XXXX" />
                            </div>
                            
                            {/* Row 2 */}
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Student First Name *</label>
                                <input {...register('firstName', {required:true})} className="input" />
                            </div>
                            <div className="col-span-6 md:col-span-2">
                                <label className="label">Relation</label>
                                <select {...register('relationType')} className="input">
                                    <option value="Father">Father</option>
                                    <option value="Husband">Husband</option>
                                </select>
                            </div>
                             <div className="col-span-6 md:col-span-2">
                                <label className="label">{watchRelation} Name</label>
                                <input {...register('middleName')} className="input" />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Last Name *</label>
                                <input {...register('lastName', {required:true})} className="input" />
                            </div>

                            {/* Row 3 */}
                            <div className="col-span-6 md:col-span-3">
                                <label className="label">Occupation Type</label>
                                <select {...register('occupationType')} className="input">
                                    <option value="Student">Student</option>
                                    <option value="Service">Service</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="col-span-6 md:col-span-3">
                                <label className="label">Occupation Name</label>
                                <input {...register('occupationName')} className="input" />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <label className="label">Mother Name</label>
                                <input {...register('motherName')} className="input" />
                            </div>

                            {/* Row 4 */}
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Email</label>
                                <input type="email" {...register('email')} className="input" />
                            </div>
                            <div className="col-span-6 md:col-span-4">
                                <label className="label">Date of Birth</label>
                                <input type="date" {...register('dob', {required:true})} className="input" />
                            </div>
                            <div className="col-span-6 md:col-span-4">
                                <label className="label">Gender</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2"><input type="radio" value="Male" {...register('gender')} /> Male</label>
                                    <label className="flex items-center gap-2"><input type="radio" value="Female" {...register('gender')} /> Female</label>
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Home Contact</label>
                                <input {...register('contactHome', {maxLength:10})} className="input" />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Student Mobile</label>
                                <input {...register('mobileStudent', {maxLength:10})} className="input" />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Parent Mobile *</label>
                                <input {...register('mobileParent', {required:true, maxLength:10})} className="input border-l-4 border-blue-500" />
                            </div>

                            {/* Row 6 - Education */}
                            <div className="col-span-12">
                                <label className="label">Education</label>
                                <input list="eduOptions" {...register('education')} className="input" placeholder="Select or type..." />
                                <datalist id="eduOptions">
                                    <option value="10th Pass"/><option value="12th Pass"/><option value="Graduate"/><option value="Post Graduate"/>
                                </datalist>
                            </div>

                            {/* Row 7 - Address */}
                            <div className="col-span-12">
                                <label className="label">Full Address</label>
                                <textarea {...register('address')} rows="1" className="input"></textarea>
                            </div>

                            {/* Row 8 - Location */}
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">State</label>
                                <select {...register('state')} className="input">
                                    {Object.keys(LOCATION_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">City</label>
                                <select {...register('city')} className="input">
                                    {LOCATION_DATA[watchState]?.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <label className="label">Pincode</label>
                                <input {...register('pincode')} className="input" />
                            </div>

                            {/* Row 9 - Reference */}
                            <div className="col-span-12 md:col-span-8 bg-gray-50 p-3 rounded border">
                                <label className="label text-blue-800">Reference</label>
                                <select {...register('reference')} className="input mb-2">
                                    <option value="Direct">Direct / Walk-in</option>
                                    <optgroup label="Employees">
                                        {employees?.map(e => <option key={e._id} value={e.name}>{e.name}</option>)}
                                    </optgroup>
                                    <option value="NEW_REF">+ Add New Reference</option>
                                </select>
                                {isNewReference && (
                                    <div className="grid grid-cols-3 gap-2 animate-fadeIn">
                                        <input {...register('refName')} placeholder="Ref Name" className="input text-sm" />
                                        <input {...register('refMobile')} placeholder="Mobile" className="input text-sm" />
                                        <input {...register('refAddress')} placeholder="Address" className="input text-sm" />
                                    </div>
                                )}
                            </div>

                            {/* Photo Upload */}
                            <div className="col-span-12 md:col-span-4 flex justify-center items-center border-2 border-dashed rounded-lg p-2 bg-gray-50">
                                <label className="cursor-pointer text-center">
                                    {previewImage ? (
                                        <img src={previewImage} className="h-20 w-20 rounded-full mx-auto object-cover border" />
                                    ) : (
                                        <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center"><Upload className="text-gray-400"/></div>
                                    )}
                                    <span className="text-xs text-blue-600 font-bold block mt-1">Upload Photo</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>

                            <div className="col-span-12 flex justify-end mt-6">
                                <button type="button" onClick={async () => { if (await trigger()) setStep(2); }} className="btn-primary">
                                    Next: Course <ChevronRight size={18}/>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2: COURSE & BATCH --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="overflow-x-auto border rounded-lg max-h-60 overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 uppercase sticky top-0">
                                        <tr>
                                            <th className="p-3">Select</th>
                                            <th className="p-3">Course Name</th>
                                            <th className="p-3">Fees</th>
                                            <th className="p-3">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {courses.map((course) => (
                                            <tr key={course._id} className={watchCourseSelection === course._id ? 'bg-blue-50' : ''}>
                                                <td className="p-3"><input type="radio" value={course._id} {...register('selectedCourseId')} /></td>
                                                <td className="p-3 font-medium">{course.name}</td>
                                                <td className="p-3">₹ {course.courseFees}</td>
                                                <td className="p-3">{course.duration} {course.durationType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {watchCourseSelection && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded border">
                                    <div className="col-span-2">
                                        <label className="label">Select Batch</label>
                                        <select {...register('selectedBatch')} className="input">
                                            <option value="">-- Choose --</option>
                                            {batches.filter(b =>
                                            b.course === watchCourseSelection || 
                                            b.courses?.some(c => (c._id || c) === watchCourseSelection))
                                                .map(b => <option key={b._id} value={b.name}>{b.name} ({b.startTime} - {b.endTime})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Start Date</label>
                                        <input type="date" {...register('batchStartDate')} className="input" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className="label">Payment Plan</label>
                                        <select {...register('paymentType')} className="input">
                                            <option value="One Time">One Time</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button type="button" onClick={handleAddCourseToList} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold flex justify-center gap-1">
                                            <Plus size={16}/> Add
                                        </button>
                                    </div>
                                </div>
                            )}

                            {previewCourses.length > 0 && (
                                <div className="border rounded bg-white mt-4">
                                    <div className="bg-gray-800 text-white p-2 text-sm font-bold">Selected Course Preview</div>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 border-b">
                                            <tr>
                                                <th className="p-2">Course</th>
                                                <th className="p-2">Batch</th>
                                                <th className="p-2">Time</th>
                                                <th className="p-2">Fees</th>
                                                <th className="p-2">Type</th>
                                                <th className="p-2 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewCourses.map((item, idx) => (
                                                <tr key={idx} className="border-b">
                                                    <td className="p-2">{item.courseName}</td>
                                                    <td className="p-2">{item.batch}</td>
                                                    <td className="p-2">{item.batchTime}</td>
                                                    <td className="p-2">{item.fees}</td>
                                                    <td className="p-2">{item.paymentType}</td>
                                                    <td className="p-2 text-right"><button onClick={() => setPreviewCourses([])} className="text-red-500"><Trash2 size={16}/></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {previewCourses[0].paymentType === 'Monthly' && (
                                        <div className="p-3 bg-yellow-50 text-xs text-yellow-800 font-mono">
                                            Reg Fees: ₹{previewCourses[0].emiConfig?.registrationFees} | EMI: ₹{previewCourses[0].emiConfig?.monthlyInstallment}/mo
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-bold text-gray-800 mb-2">Do you want to add admission fee detail?</h3>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 border p-3 rounded w-1/3 cursor-pointer hover:bg-blue-50">
                                        <input type="radio" checked={payAdmissionFee === true} onChange={() => setPayAdmissionFee(true)} className="w-5 h-5"/>
                                        <span className="font-bold text-blue-700">YES, Pay Now</span>
                                    </label>
                                    <label className="flex items-center gap-2 border p-3 rounded w-1/3 cursor-pointer hover:bg-red-50">
                                        <input type="radio" checked={payAdmissionFee === false} onChange={() => setPayAdmissionFee(false)} className="w-5 h-5"/>
                                        <span className="font-bold text-gray-700">NO, Pay Later</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary"><ChevronLeft/> Back</button>
                                {payAdmissionFee ? (
                                    <button type="button" onClick={() => previewCourses.length > 0 ? setStep(3) : toast.error("Add Course")} className="btn-primary">Next <ChevronRight/></button>
                                ) : (
                                    <button type="submit" disabled={previewCourses.length===0} className="bg-green-600 text-white px-6 py-2 rounded flex gap-2 font-bold hover:bg-green-700">
                                        <Save size={18}/> Admit Student
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: FEES --- */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto animate-fadeIn border rounded p-6 bg-blue-50">
                            <h3 className="text-xl font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Fee Receipt</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="label">Receipt No</label><input className="input bg-gray-200" value="AUTO-GEN" disabled /></div>
                                <div><label className="label">Date</label><input type="date" {...register('receiptDate')} className="input" /></div>
                                <div><label className="label">Total Fees</label><div className="text-2xl font-bold text-gray-800">₹ {previewCourses[0]?.fees}</div></div>
                                <div><label className="label">Amount Paid *</label><input type="number" {...register('amountPaid', {required:true})} className="input border-green-500 border-2" /></div>
                                <div><label className="label">Mode</label><select {...register('receiptPaymentMode')} className="input"><option>Cash</option><option>Online</option><option>Cheque</option></select></div>
                                <div><label className="label">Remarks</label><input {...register('remarks')} className="input" placeholder="Optional" /></div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setStep(2)} className="btn-secondary">Back</button>
                                <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700 flex gap-2"><Save size={18}/> Confirm & Print</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <style>{`
                .label { display:block; font-size:0.7rem; font-weight:700; color:#4b5563; text-transform:uppercase; margin-bottom:0.25rem; }
                .input { width:100%; border:1px solid #d1d5db; padding:0.4rem; border-radius:0.3rem; outline:none; font-size:0.9rem; }
                .input:focus { border-color:#2563eb; ring:2px; }
                .btn-primary { background:#2563eb; color:white; padding:0.5rem 1.5rem; border-radius:0.3rem; display:flex; align-items:center; gap:0.5rem; font-weight:600; }
                .btn-secondary { background:white; border:1px solid #9ca3af; padding:0.5rem 1.5rem; border-radius:0.3rem; display:flex; align-items:center; gap:0.5rem; }
            `}</style>
        </div>
    );
};
export default StudentAdmission;