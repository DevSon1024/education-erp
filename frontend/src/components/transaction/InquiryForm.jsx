import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Save, X, Camera, User, Phone, BookOpen, Calendar, Copy, Clipboard, RotateCcw, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const InquiryForm = ({ mode, initialData, onClose, onSave }) => {
    const { courses } = useSelector((state) => state.master);
    const [preview, setPreview] = useState(null);
    const [isOthersEducation, setIsOthersEducation] = useState(false);
    const [showRefDetails, setShowRefDetails] = useState(false);
    const [customEdu, setCustomEdu] = useState('');

    // Determine source based on mode
    let fixedSource = 'Walk-in';
    if (mode === 'DSR') fixedSource = 'DSR';
    if (mode === 'Online') fixedSource = 'Online';
    if (mode === 'Edit') fixedSource = initialData?.source || 'Walk-in';

    const { register, handleSubmit, reset, setValue, watch, getValues } = useForm({
        defaultValues: {
            city: 'Surat',
            state: 'Gujarat',
            inquiryDate: new Date().toISOString().split('T')[0],
            source: fixedSource,
            relationType: 'Father'
        }
    });

    // Helper for file preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setValue('studentPhoto', file); 
        }
    };

    // Copy / Paste Logic
    const handleCopy = () => {
        const data = getValues();
        // Exclude sensitive or unique fields if needed, but request said "copy content of full form"
        localStorage.setItem('copiedInquiryForm', JSON.stringify(data));
        toast.info('Form data copied to clipboard (local storage)');
    };

    const handlePaste = () => {
        const dataStr = localStorage.getItem('copiedInquiryForm');
        if (dataStr) {
            const data = JSON.parse(dataStr);
            // Don't overwrite ID or Date unless intended. Request said "same form is filling up again"
            // We usually want fresh dates for new inquiry
            reset({
                ...data,
                inquiryDate: new Date().toISOString().split('T')[0], // Reset date to today
                _id: undefined // Don't copy ID
            });
            toast.success('Form data pasted!');
        } else {
            toast.warn('No copied data found');
        }
    };

    useEffect(() => {
        if (initialData) {
            // Check if this is a visitor conversion
            if (initialData.isConversion) {
                reset({
                    firstName: initialData.studentName, 
                    contactStudent: initialData.mobileNumber,
                    contactParent: '',
                    interestedCourse: initialData.course?._id || initialData.course,
                    referenceBy: initialData.reference,
                    inquiryDate: initialData.visitingDate ? new Date(initialData.visitingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    source: 'Walk-in',
                    visitorId: initialData._id, 
                    city: 'Surat',
                    state: 'Gujarat',
                    relationType: 'Father'
                });
            } else {
                // Normal Edit Mode
                const formattedData = {
                    ...initialData,
                    interestedCourse: initialData.interestedCourse?._id || initialData.interestedCourse,
                    inquiryDate: initialData.inquiryDate ? initialData.inquiryDate.split('T')[0] : '',
                    dob: initialData.dob ? initialData.dob.split('T')[0] : '',
                    followUpDate: initialData.followUpDate ? initialData.followUpDate.split('T')[0] : '',
                    relationType: initialData.relationType || 'Father'
                };
                
                // Handle complex fields manually
                if (initialData.customEducation) {
                    setIsOthersEducation(true);
                    setCustomEdu(initialData.customEducation);
                    setValue('education', 'Other');
                }
                
                // If photo exists (and is string path), show preview logic could be added here if backend serves static files
                if (initialData.studentPhoto) {
                    // Assuming backend static file serving is set up at root or specific URL
                    // For now just showing a placeholder if string, real preview needs full URL
                    // setPreview(`http://localhost:5000/${initialData.studentPhoto}`);
                }

                reset(formattedData);
            }
        } else {
            // Reset for New Entry
            reset({
                city: 'Surat',
                state: 'Gujarat',
                inquiryDate: new Date().toISOString().split('T')[0],
                source: fixedSource,
                relationType: 'Father',
                contactHome: '-',
                contactParent: '-',
                contactStudent: '-'
            });
        }
    }, [initialData, reset, fixedSource, setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        
        // Append all standard fields
        Object.keys(data).forEach(key => {
            if (key === 'studentPhoto' && data[key] instanceof File) {
                formData.append('studentPhoto', data[key]);
            } else if (key === 'referenceDetail' && typeof data[key] === 'object') {
                 formData.append('referenceDetail', JSON.stringify(data[key]));
            } else if (data[key] !== undefined && data[key] !== null && key !== 'studentPhoto') {
                formData.append(key, data[key]);
            }
        });

        // Handle specific logic
        if (initialData?._id && !initialData.isConversion) formData.append('_id', initialData._id);
        
        if (customEdu && data.education === 'Other') {
             formData.append('customEducation', customEdu);
        }
        
        // Ensure source is set
        if (!data.source) formData.append('source', fixedSource);

        onSave(formData); // Pass FormData object
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-fadeIn relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg flex-none">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Inquiry' : `New ${mode} Inquiry`}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
                </div>
                
                {/* Scrollable Body */}
                <div className="overflow-y-auto p-4 sm:p-6 flex-grow">
                    <form id="inquiry-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* 1. Personal Details */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <User size={16}/> Personal Information
                        </h4>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Photo Upload - Drag & Drop Style */}
                            <div className="w-full md:w-40 flex-shrink-0">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Student Photo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative">
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="text-gray-400 mb-1"/>
                                            <p className="text-[10px] text-gray-500 text-center px-1">Drag or Click to Upload</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-grow">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Inquiry Date</label>
                                    <input type="date" {...register('inquiryDate')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">First Name *</label>
                                    <input {...register('firstName', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="First Name"/>
                                </div>
                                
                                {/* Father/Husband Combined */}
                                <div className="flex gap-1">
                                    <div className="w-1/3">
                                        <label className="block text-xs font-bold text-gray-700">Relation</label>
                                        <select {...register('relationType')} className="w-full border p-2 rounded text-sm">
                                            <option>Father</option><option>Husband</option>
                                        </select>
                                    </div>
                                    <div className="w-2/3">
                                        <label className="block text-xs font-bold text-gray-700">Name</label>
                                        <input {...register('middleName')} className="w-full border p-2 rounded text-sm" placeholder="Name"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Last Name</label>
                                    <input {...register('lastName')} className="w-full border p-2 rounded text-sm" placeholder="Surname"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Email Address</label>
                                    <input type="email" {...register('email')} className="w-full border p-2 rounded text-sm" placeholder="student@example.com"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Gender</label>
                                    <select {...register('gender')} className="w-full border p-2 rounded text-sm">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                    <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Contact & Address */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <Phone size={16}/> Contact & Location
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Student) *</label>
                                <input {...register('contactStudent', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="Mobile No"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Home)</label>
                                <input {...register('contactHome')} className="w-full border p-2 rounded text-sm" placeholder="Landline/Other"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Parent)</label>
                                <input {...register('contactParent')} className="w-full border p-2 rounded text-sm" placeholder="Parent No"/>
                            </div>
                            
                             <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700">City</label>
                                <input {...register('city')} className="w-full border p-2 rounded text-sm"/>
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <textarea {...register('address')} rows="1" className="w-full border p-2 rounded text-sm" placeholder="Full Address"></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700">State</label>
                                <select {...register('state')} className="w-full border p-2 rounded text-sm">
                                    <option>Gujarat</option><option>Maharashtra</option><option>Rajasthan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Academic & Inquiry */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <BookOpen size={16}/> Academic & Course Interest
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <select 
                                    {...register('education')} 
                                    className="w-full border p-2 rounded text-sm"
                                    onChange={(e) => setIsOthersEducation(e.target.value === 'Other')}
                                >
                                    <option value="">-- Select --</option>
                                    <option>SSC</option><option>HSC</option><option>Graduate</option><option>Post Graduate</option>
                                    <option value="Other">Other (Add Custom)</option>
                                </select>
                                {isOthersEducation && (
                                    <input 
                                        type="text" 
                                        value={customEdu}
                                        onChange={(e) => setCustomEdu(e.target.value)}
                                        placeholder="Specify Education" 
                                        className="w-full border p-2 rounded text-sm mt-1 bg-yellow-50"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Qualification</label>
                                <input {...register('qualification')} className="w-full border p-2 rounded text-sm" placeholder="e.g. B.Com"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Interested Course</label>
                                <select {...register('interestedCourse')} className="w-full border p-2 rounded text-sm">
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            
                            {/* Reference Logic */}
                            <div className="relative">
                                <div className="flex justify-between items-center">
                                    <label className="block text-xs font-bold text-gray-700">Reference</label>
                                    <button type="button" onClick={() => setShowRefDetails(!showRefDetails)} className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                                        <Plus size={10}/> {showRefDetails ? 'Hide' : 'Add New'}
                                    </button>
                                </div>
                                <input {...register('referenceBy')} className="w-full border p-2 rounded text-sm" placeholder="Name or Source"/>
                                
                                {showRefDetails && (
                                    <div className="absolute top-16 left-0 right-0 bg-white border shadow-lg z-10 p-3 rounded space-y-2">
                                        <p className="text-xs font-bold text-gray-500 mb-1">New Reference Detail</p>
                                        <input {...register('referenceDetail.name')} placeholder="Name" className="w-full border p-1 text-xs rounded"/>
                                        <input {...register('referenceDetail.mobile')} placeholder="Mobile" className="w-full border p-1 text-xs rounded"/>
                                        <input {...register('referenceDetail.address')} placeholder="Address" className="w-full border p-1 text-xs rounded"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Follow Up Details Section */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <Calendar size={16}/> Follow-up Initial Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700">Update Date</label>
                                        <input type="date" {...register('followUpDate')} className="w-full border p-2 rounded text-sm"/>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700">Time (12h)</label>
                                        <input type="time" name="followUpTime" className="w-full border p-2 rounded text-sm" /> 
                                        {/* Ideally merge this into followUpDate before submit if needed, or keeping it separate for now */}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Details</label>
                                <textarea {...register('followUpDetails')} rows="1" className="w-full border p-2 rounded text-sm" placeholder="Initial discussion notes..."/>
                            </div>
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                           <button type="button" onClick={handleCopy} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 border border-blue-200">
                                <Copy size={12}/> Copy Form
                           </button>
                           <button type="button" onClick={handlePaste} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 border border-blue-200">
                                <Clipboard size={12}/> Paste
                           </button>
                           <button type="button" onClick={() => reset()} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100 border border-gray-200">
                                <RotateCcw size={12}/> Reset
                           </button>
                        </div>
                    </div>

                    </form>
                </div>

                {/* Footer Actions */}
                 <div className="flex justify-end gap-3 p-3 border-t bg-gray-50 rounded-b-lg flex-none">
                    <button type="button" onClick={onClose} className="px-5 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" form="inquiry-form" className="bg-green-600 text-white px-8 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2 font-bold transform hover:scale-105 transition-transform">
                        <Save size={18}/> Save {mode === 'Edit' ? 'Update' : 'Inquiry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InquiryForm;