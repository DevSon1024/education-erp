import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchBatches, createBatch, fetchCourses, fetchEmployees, resetMasterStatus 
} from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { Search, Plus, X, Clock, Users } from 'lucide-react';

const BatchMaster = () => {
  const dispatch = useDispatch();
  const { batches, courses, employees, isSuccess } = useSelector((state) => state.master);
  
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [filters, setFilters] = useState({
    startDate: '', endDate: '', searchBy: 'Batch Name', searchValue: ''
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEmployees());
    dispatch(fetchBatches(filters));
  }, [dispatch]);

  const handleSearch = () => { dispatch(fetchBatches(filters)); };
  const handleReset = () => {
    setFilters({ startDate: '', endDate: '', searchBy: 'Batch Name', searchValue: '' });
    dispatch(fetchBatches({}));
  };

  useEffect(() => {
    if (isSuccess && showForm) {
        toast.success("Batch Created Successfully");
        dispatch(resetMasterStatus());
        reset();
        setShowForm(false);
        dispatch(fetchBatches(filters));
    }
  }, [isSuccess, showForm, dispatch, reset, filters]);

  const onSubmit = (data) => { dispatch(createBatch(data)); };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- SECTION 1: HEADER & ADD BUTTON (Moved to Top) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Batches</h1>
        <button 
            onClick={() => setShowForm(true)} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm font-bold"
        >
            <Plus size={20}/> Add New Batch
        </button>
      </div>

      {/* --- SECTION 2: FILTERS --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Filter Batches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
                <label className="text-xs text-gray-500 font-semibold">Start Date</label>
                <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">End Date</label>
                <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Search By</label>
                <select value={filters.searchBy} onChange={e => setFilters({...filters, searchBy: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>Batch Name</option>
                    <option>Employee Name</option>
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Value</label>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={filters.searchValue} 
                    onChange={e => setFilters({...filters, searchValue: e.target.value})} 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div className="flex gap-2">
                <button onClick={handleReset} className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 text-sm w-full font-medium transition">Reset</button>
                <button onClick={handleSearch} className="bg-primary text-white px-3 py-2 rounded hover:bg-blue-800 text-sm w-full font-medium transition">Search</button>
            </div>
        </div>
      </div>

      {/* --- SECTION 3: DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Batch Name</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Timing</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Faculty</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Start Date</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">End Date</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {batches && batches.length > 0 ? batches.map((batch) => (
                    <tr key={batch._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                            {batch.name}
                            <span className="block text-xs text-gray-400 font-normal">{batch.course?.name}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded w-fit">
                                <Clock size={12} className="text-gray-500"/> {batch.startTime} - {batch.endTime}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                                <Users size={12}/> {batch.faculty?.name || 'Unassigned'}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(batch.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(batch.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                            <button className="text-blue-600 hover:text-blue-900 mr-3 text-xs font-bold uppercase hover:underline">Edit</button>
                            <button className="text-red-600 hover:text-red-900 text-xs font-bold uppercase hover:underline">Delete</button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400">No batches found. Create one!</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- ADD BATCH MODAL --- */}
      {/* ... (Keep the Modal code exactly as it was, it is correct) ... */}
       {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
                <div className="bg-primary text-white p-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Plus size={20}/> Create New Batch</h2>
                    <button onClick={() => setShowForm(false)} className="text-white hover:text-red-200 transition"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Batch Name */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Name *</label>
                        <input {...register('name', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Morning Batch A"/>
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Course *</label>
                        <select {...register('course', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Faculty */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Faculty *</label>
                        <select {...register('faculty', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                            <option value="">Select Faculty</option>
                            {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                        </select>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Size</label>
                        <input type="number" {...register('batchSize')} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 30"/>
                    </div>

                    {/* Dates */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date *</label>
                        <input type="date" {...register('startDate', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Date *</label>
                        <input type="date" {...register('endDate', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                    </div>

                    {/* Timing */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Time *</label>
                        <input type="time" {...register('startTime', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Time *</label>
                        <input type="time" {...register('endTime', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                    </div>

                    <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t mt-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded hover:bg-gray-100 text-sm font-medium">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow text-sm font-bold transition">Save Batch</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default BatchMaster;