import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchCourses, createCourse, fetchSubjects, resetMasterStatus 
} from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { Search, Plus, X, Edit, Trash2, CheckSquare, Square, Book, List } from 'lucide-react';

const CourseMaster = () => {
  const dispatch = useDispatch();
  const { courses, subjects, isSuccess } = useSelector((state) => state.master);
  
  const [showForm, setShowForm] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(null); 
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Filters
  const [filters, setFilters] = useState({ courseId: '', courseType: '' });

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  useEffect(() => { setValue('isActive', true); }, [setValue]);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (isSuccess && showForm) {
        toast.success("Course Saved Successfully!");
        dispatch(resetMasterStatus());
        reset();
        setSelectedSubjects([]);
        setShowForm(false);
        dispatch(fetchCourses(filters));
    }
  }, [isSuccess, showForm, dispatch]);

  const handleSubjectChange = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
        setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
        setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const onSubmit = (data) => {
    const finalData = { ...data, subjects: selectedSubjects };
    dispatch(createCourse(finalData));
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- SECTION 1: HEADER & ADD BUTTON (Moved to Top) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Courses</h1>
        <button 
            onClick={() => setShowForm(true)} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm font-bold"
        >
            <Plus size={20}/> Add New Course
        </button>
      </div>

      {/* --- SECTION 2: FILTERS --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Search & Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
                <label className="text-xs text-gray-500 font-semibold">Course Name</label>
                <select 
                    value={filters.courseId} 
                    onChange={(e) => setFilters({...filters, courseId: e.target.value})}
                    className="w-full border p-2 rounded text-sm mt-1 focus:ring-2 focus:ring-primary outline-none"
                >
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Course Type</label>
                <select 
                    value={filters.courseType} 
                    onChange={(e) => setFilters({...filters, courseType: e.target.value})}
                    className="w-full border p-2 rounded text-sm mt-1 focus:ring-2 focus:ring-primary outline-none"
                >
                    <option value="">All Types</option>
                    <option>Accounting</option>
                    <option>Designing</option>
                    <option>Diploma</option>
                    <option>IT for Beginners</option>
                    <option>Global IT Certifications</option>
                </select>
            </div>
            <div>
                <button 
                    onClick={() => dispatch(fetchCourses(filters))}
                    className="bg-primary text-white w-full py-2 rounded shadow hover:bg-blue-800 text-sm font-medium transition-colors"
                >
                    Apply Filters
                </button>
            </div>
        </div>
      </div>

      {/* --- SECTION 3: DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded"/></th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Course Name</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Type</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Fees</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Duration</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Active</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Subjects</th>
                        <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {courses.length > 0 ? courses.map((course) => (
                        <tr key={course._id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-4 py-3"><input type="checkbox" className="rounded"/></td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {course.name}
                                <span className="block text-xs text-gray-400">({course.shortName})</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{course.courseType}</td>
                            <td className="px-4 py-3 text-green-700 font-bold">₹ {course.courseFees}</td>
                            <td className="px-4 py-3 text-gray-600">{course.duration} {course.durationType}</td>
                            <td className="px-4 py-3 text-center">
                                {course.isActive ? 
                                    <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">YES</span> : 
                                    <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">NO</span>
                                }
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button 
                                    onClick={() => setShowSubjectModal(course)}
                                    className="text-primary hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 w-fit mx-auto transition-colors"
                                >
                                    <List size={14} /> View ({course.subjects?.length || 0})
                                </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"><Edit size={16}/></button>
                                    <button className="p-1 text-red-600 hover:bg-red-100 rounded transition"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="8" className="text-center py-8 text-gray-400">No courses found. Add a new one!</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- ADD COURSE MODAL (Same logic as before) --- */}
      {/* ... (Keep the Modal code exactly as it was in the previous response, it is correct) ... */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Book size={20}/> Add New Course</h2>
                    <button onClick={() => setShowForm(false)} className="text-white hover:text-red-200 transition"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Section 1: Basic Info */}
                        <div className="md:col-span-3">
                            <h3 className="text-sm font-bold text-gray-500 border-b pb-1 mb-3 uppercase">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700">Course Name *</label>
                                    <input {...register('name', {required:true})} className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Advance Degree of Computer Application"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Short Name *</label>
                                    <input {...register('shortName', {required:true})} className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. ADCA"/>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-700">Description</label>
                                    <textarea {...register('description')} className="w-full border p-2 rounded text-sm mt-1" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Type & Duration */}
                        <div className="md:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Course Type *</label>
                                    <select {...register('courseType', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                        <option value="">Select Type</option>
                                        <option>Accounting</option>
                                        <option>Designing</option>
                                        <option>Diploma</option>
                                        <option>IT for Beginners</option>
                                        <option>Global IT Certifications</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Duration *</label>
                                    <input type="number" {...register('duration', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Duration Type *</label>
                                    <select {...register('durationType', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                        <option>Month</option>
                                        <option>Year</option>
                                        <option>Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Sorting Order</label>
                                    <input type="number" {...register('sorting')} className="w-full border p-2 rounded text-sm mt-1" defaultValue="0"/>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Fees & Financials */}
                        <div className="md:col-span-3">
                            <h3 className="text-sm font-bold text-gray-500 border-b pb-1 mb-3 uppercase mt-2">Financial Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Course Fees *</label>
                                    <input type="number" {...register('courseFees', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Admission Fees</label>
                                    <input type="number" {...register('admissionFees')} className="w-full border p-2 rounded text-sm mt-1" defaultValue="0"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Reg. Fees</label>
                                    <input type="number" {...register('registrationFees')} className="w-full border p-2 rounded text-sm mt-1" defaultValue="0"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Monthly Fees</label>
                                    <input type="number" {...register('monthlyFees')} className="w-full border p-2 rounded text-sm mt-1" defaultValue="0"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Total Installments</label>
                                    <input type="number" {...register('totalInstallment')} className="w-full border p-2 rounded text-sm mt-1" defaultValue="1"/>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Subjects */}
                        <div className="md:col-span-3">
                            <h3 className="text-sm font-bold text-gray-500 border-b pb-1 mb-3 uppercase mt-2">Subjects</h3>
                            <div className="h-32 overflow-y-auto border p-3 rounded bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-2">
                                {subjects.length > 0 ? subjects.map(sub => (
                                    <label key={sub._id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedSubjects.includes(sub._id)}
                                            onChange={() => handleSubjectChange(sub._id)}
                                            className="form-checkbox text-primary rounded"
                                        />
                                        {sub.name}
                                    </label>
                                )) : <div className="text-gray-400 text-xs">No subjects found. Please add subjects first.</div>}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="md:col-span-3 flex justify-between items-center border-t pt-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" {...register('isActive')} className="w-5 h-5 text-green-600 rounded"/>
                                <span className="text-sm font-bold text-gray-700">Is Active?</span>
                            </label>
                            
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded hover:bg-gray-100 text-sm font-medium">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-8 py-2 rounded hover:bg-blue-800 shadow text-sm font-bold transition">Save Course</button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- Subject View Modal --- */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded p-6 max-w-sm w-full animate-fadeIn">
                <h3 className="font-bold mb-4 text-gray-800">{showSubjectModal.name} - Subjects</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                    {showSubjectModal.subjects?.length > 0 ? showSubjectModal.subjects.map(sub => (
                        <li key={sub._id}>{sub.name}</li>
                    )) : <li className="text-gray-400">No subjects assigned</li>}
                </ul>
                <button onClick={() => setShowSubjectModal(null)} className="mt-6 w-full bg-gray-200 py-2 rounded text-sm hover:bg-gray-300 font-bold text-gray-700">Close</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default CourseMaster;