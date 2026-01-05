import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Save, X, Camera, User, Phone, BookOpen, MapPin, Calendar } from 'lucide-react';

const InquiryForm = ({ mode, initialData, onClose, onSave }) => {
    const { courses } = useSelector((state) => state.master);
    
    // Determine source based on mode ('DSR' -> 'DSR', 'Offline' -> 'Walk-in')
    const fixedSource = mode === 'DSR' ? 'DSR' : 'Walk-in';

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            city: 'Surat',
            state: 'Gujarat',
            inquiryDate: new Date().toISOString().split('T')[0],
            source: fixedSource
        }
    });

    useEffect(() => {
        if (initialData) {
            // Populate form for Edit
            const formattedData = {
                ...initialData,
                interestedCourse: initialData.interestedCourse?._id,
                inquiryDate: initialData.inquiryDate ? initialData.inquiryDate.split('T')[0] : '',
                dob: initialData.dob ? initialData.dob.split('T')[0] : '',
                followUpDate: initialData.followUpDate ? initialData.followUpDate.split('T')[0] : '',
                // Keep the source as is if editing, or enforce mode if new
            };
            reset(formattedData);
        } else {
            // Reset for New Entry
            reset({
                city: 'Surat',
                state: 'Gujarat',
                inquiryDate: new Date().toISOString().split('T')[0],
                source: fixedSource
            });
        }
    }, [initialData, reset, fixedSource]);

    const onSubmit = (data) => {
        // Ensure source is forced for new entries or strict modes
        const payload = { ...data, source: fixedSource };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl m-4 relative animate-fadeIn">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Inquiry' : `New ${mode} Inquiry`}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    
                    {/* 1. Personal Details */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <User size={16}/> Personal Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Inquiry Date</label>
                                <input type="date" {...register('inquiryDate')} className="w-full border p-2 rounded text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">First Name *</label>
                                <input {...register('firstName', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="First Name"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Father/Husband Name</label>
                                <input {...register('middleName')} className="w-full border p-2 rounded text-sm" placeholder="Middle Name"/>
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

                    {/* 2. Contact & Address */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <Phone size={16}/> Contact & Location
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Student)</label>
                                <input {...register('contactStudent', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="Mobile No"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Parent)</label>
                                <input {...register('contactParent')} className="w-full border p-2 rounded text-sm" placeholder="Parent No"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Home)</label>
                                <input {...register('contactHome')} className="w-full border p-2 rounded text-sm" placeholder="Landline/Other"/>
                            </div>
                            <div className="md:col-span-1"></div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <textarea {...register('address')} rows="1" className="w-full border p-2 rounded text-sm" placeholder="Full Address"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">City</label>
                                <input {...register('city')} className="w-full border p-2 rounded text-sm"/>
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <select {...register('education')} className="w-full border p-2 rounded text-sm">
                                    <option value="">-- Select --</option>
                                    <option>SSC</option><option>HSC</option><option>Graduate</option><option>Post Graduate</option>
                                </select>
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
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Reference / Referred By</label>
                                <input {...register('referenceBy')} className="w-full border p-2 rounded text-sm" placeholder="Name or Source Detail"/>
                            </div>
                        </div>
                    </div>

                    {/* 4. Follow Up & Photo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                             <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                                <Calendar size={16}/> Initial Follow-Up
                             </h4>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Next Follow-Up Date</label>
                                    <input type="date" {...register('followUpDate')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Remarks / Details</label>
                                    <input {...register('followUpDetails')} className="w-full border p-2 rounded text-sm" placeholder="Initial discussion notes..."/>
                                </div>
                             </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                                <Camera size={16}/> Photo
                            </h4>
                            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer h-24 flex flex-col justify-center items-center">
                                <p className="text-xs text-gray-500">Drag & Drop</p>
                                <input type="file" className="hidden" /> 
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={() => reset()} className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-100">Reset</button>
                        <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2">
                            <Save size={18}/> Save {mode} Inquiry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InquiryForm;