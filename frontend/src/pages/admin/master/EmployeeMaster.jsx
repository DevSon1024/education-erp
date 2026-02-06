import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee, resetEmployeeStatus } from '../../../features/employee/employeeSlice';
import { getBranches } from '../../../features/master/branchSlice'; // Import API
import { formatInputText } from '../../../utils/textFormatter';
import { toast } from 'react-toastify';
import { Search, Plus, X, Upload, User, Briefcase, Lock, Trash2, Edit, RotateCcw, Loader } from 'lucide-react';
import ProfileImageUploader from '../../../components/common/ProfileImageUploader';

import { useUserRights } from '../../../hooks/useUserRights';

const EmployeeMaster = () => {
  const dispatch = useDispatch();
  const { employees, isSuccess, isError, message, isLoading } = useSelector((state) => state.employees);
  const { branches } = useSelector((state) => state.branch);
  const { user } = useSelector((state) => state.auth); // Get Auth User
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null); // Store actual File object
  const [isImageProcessing, setIsImageProcessing] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const watchName = watch('name');
  const watchType = watch('type');

  // Permission Check
  const { view, add, edit, delete: canDelete } = useUserRights('Employee');

  // If view is false, we might want to redirect or show a message.
  // For now, we just proceed but the list might be useless if they can't even see the page link in Navbar.

  // --- FILTERS STATE ---
  const initialFilters = {
    joiningFrom: '', 
    joiningTo: new Date().toISOString().split('T')[0],
    gender: '', 
    searchBy: 'name', 
    searchValue: '',
    pageSize: 10
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    dispatch(fetchEmployees(filters));
    if(user?.role === 'Super Admin') {
        dispatch(getBranches());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]); // Auto-fetch only on mount (and user change), not on filters change

  useEffect(() => {
    if (isError) {
        toast.error(message);
        dispatch(resetEmployeeStatus());
    }
    if (isSuccess && (showForm || message.includes('Deleted'))) {
        toast.success(message);
        dispatch(resetEmployeeStatus());
        if(showForm) closeForm();
    }
  }, [isSuccess, isError, message, showForm, dispatch]);

  // Auto Generate Credentials
  useEffect(() => {
    if (!editMode && showForm && watchName && watchName.length > 2) {
        const parts = watchName.trim().split(' ');
        let usernameBase = '';
        if (parts.length > 1) {
            const first = parts[0];
            const last = parts[parts.length - 1];
            usernameBase = first.substring(0, Math.ceil(first.length / 2)) + 
                           last.substring(0, Math.ceil(last.length / 2));
        } else {
            usernameBase = parts[0];
        }
        const randomNum = Math.floor(100 + Math.random() * 900);
        setValue('loginUsername', `${usernameBase.toLowerCase()}${randomNum}`);
        setValue('loginPassword', Math.random().toString(36).slice(-8));
    }
  }, [watchName, editMode, showForm, setValue]);



  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
        setIsSubmitting(false);
    }
  }, [isLoading]);

  const onSubmit = (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // If there's a photo file, we need to use FormData
    let submitData = data;
    
    if (photoFile) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'photo' && data[key] != null) {
                formData.append(key, data[key]);
            }
        });
        formData.append('photo', photoFile);
        submitData = formData;
    }
    
    if (editMode && edit) {
        dispatch(updateEmployee({ id: currentId, data: submitData }));
    } else if (add) {
        dispatch(createEmployee(submitData));
    }
  };

  const handleEdit = (emp) => {
      if(!edit) return;
      setEditMode(true);
      setCurrentId(emp._id);
      setShowForm(true);
      setPreviewImage(emp.photo || null);
      reset({
          ...emp,
          branchId: emp.branchId ? (typeof emp.branchId === 'object' ? emp.branchId._id : emp.branchId) : '',
          dob: emp.dob ? emp.dob.split('T')[0] : '',
          dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '',
          loginPassword: '' 
      });
  };

  const handleDelete = (id) => {
      if(!canDelete) return;
      if(window.confirm("Are you sure you want to delete this employee?")) {
          dispatch(deleteEmployee(id));
      }
  };

  const closeForm = () => {
      setShowForm(false);
      setEditMode(false);
      setCurrentId(null);
      setPreviewImage(null);
      setPhotoFile(null);
      reset();
  };

  const resetFilters = () => {
      setFilters(initialFilters);
      dispatch(fetchEmployees(initialFilters));
  };

  const handlePageSizeChange = (e) => {
      const size = parseInt(e.target.value);
      const updated = { ...filters, pageSize: size };
      setFilters(updated);
      dispatch(fetchEmployees(updated));
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Header --- */}
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight text-center mb-6">Manage Employees</h1>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
            <Search size={16}/> Search Employees
        </h2>
        
        <div className="flex flex-col gap-4">
             {/* Row 1: Dates & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Joining Date From */}
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-1 block">Joining From</label>
                    <input 
                        type="date" 
                        value={filters.joiningFrom} 
                        onChange={e => setFilters({...filters, joiningFrom: e.target.value})} 
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Joining Date To */}
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-1 block">To Date</label>
                    <input 
                        type="date" 
                        value={filters.joiningTo} 
                        onChange={e => setFilters({...filters, joiningTo: e.target.value})} 
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Gender Filter */}
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-1 block">Gender</label>
                    <select 
                        value={filters.gender} 
                        onChange={e => setFilters({...filters, gender: e.target.value})} 
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            {/* Row 2: Search By & Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Search By */}
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-1 block">Search By</label>
                    <select 
                        value={filters.searchBy} 
                        onChange={e => setFilters({...filters, searchBy: e.target.value})} 
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="name">Employee Name</option>
                        <option value="email">Email ID</option>
                        <option value="mobile">Mobile Number</option>
                    </select>
                </div>

                {/* Search Value */}
                <div>
                    <label className="text-xs text-gray-500 font-semibold mb-1 block">Value</label>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={filters.searchValue} 
                        onChange={e => setFilters({...filters, searchValue: e.target.value})} 
                        className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Row 3: Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                    onClick={resetFilters} 
                    className="bg-red-100 text-red-700 px-6 py-2.5 rounded hover:bg-red-200 font-medium transition text-sm flex items-center justify-center gap-2"
                >
                    <RotateCcw size={16}/> Reset
                </button>
                <button 
                    onClick={() => dispatch(fetchEmployees(filters))} 
                    className="bg-primary text-white px-6 py-2.5 rounded hover:bg-blue-800 font-medium transition text-sm flex items-center justify-center gap-2"
                >
                   <Search size={16}/> Search
                </button>
            </div>
        </div>
      </div>

      {/* --- Action Bar --- */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select 
                value={filters.pageSize} 
                onChange={handlePageSizeChange} 
                className="border p-1 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <label className="text-sm text-gray-600">entries</label>
        </div>
        
        {add && (
            <button 
                onClick={() => { reset(); setShowForm(true); setEditMode(false); }} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 shadow text-sm font-medium"
            >
                <Plus size={18}/> Add New Employee
            </button>
        )}
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto border">
        <table className="w-full border-collapse min-w-[1200px]">
            <thead>
                <tr className="bg-blue-600 text-white text-left text-xs uppercase tracking-wider">
                    <th className="p-2 border font-semibold">Employee Name</th>
                    <th className="p-2 border font-semibold">Mobile</th>
                    <th className="p-2 border font-semibold">Email</th>
                    <th className="p-2 border font-semibold">Role</th>
                    <th className="p-2 border font-semibold">Login Name</th>
                    <th className="p-2 border font-semibold">Branch</th>
                    <th className="p-2 border font-semibold text-center">Joining Date</th>
                    <th className="p-2 border font-semibold text-center">Status</th>
                    {(edit || canDelete) && <th className="p-2 border font-semibold text-center sticky right-0 bg-blue-600 z-10 w-24">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {employees.length > 0 ? employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-blue-50 text-xs border-b border-gray-100 transition-colors">
                        <td className="p-2 border font-medium text-gray-900">
                            {emp.name}
                        </td>
                        <td className="p-2 border text-gray-600">{emp.mobile}</td>
                        <td className="p-2 border text-gray-600">{emp.email}</td>
                        <td className="p-2 border text-gray-600">{emp.type}</td>
                        <td className="p-2 border text-gray-600 font-mono text-xs">{emp.userAccount?.username || '-'}</td>
                        <td className="p-2 border text-gray-600">
                             {emp.branchId ? (
                                 <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                     {emp.branchId.name || emp.branchName}
                                 </span>
                             ) : (
                                 <span className="text-gray-400 text-xs">Main Branch</span>
                             )}
                        </td>
                        <td className="p-2 border text-center text-gray-600">
                            {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString('en-GB') : '-'}
                        </td>
                        <td className="p-2 border text-center">
                             {emp.isActive ? 
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">ACTIVE</span> : 
                                <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-200">INACTIVE</span>
                            }
                        </td>
                        {(edit || canDelete) && (
                            <td className="p-2 border text-center sticky right-0 bg-white">
                                <div className="flex justify-center gap-1">
                                    {edit && (
                                        <button onClick={() => handleEdit(emp)} className="bg-blue-50 text-blue-600 p-1 rounded border border-blue-200 hover:bg-blue-100 transition" title="Edit">
                                            <Edit size={14}/>
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button onClick={() => handleDelete(emp._id)} className="bg-red-50 text-red-600 p-1 rounded border border-red-200 hover:bg-red-100 transition" title="Delete">
                                            <Trash2 size={14}/>
                                        </button>
                                    )}
                                </div>
                            </td>
                        )}
                    </tr>
                )) : (
                    <tr><td colSpan="9" className="text-center py-8 text-gray-400">No employees found matching criteria</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- Modal Form (Same as before) --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {editMode ? <><Edit size={20}/> Update Employee</> : <><User size={20}/> Add New Employee</>}
                    </h2>
                    <button onClick={closeForm} className="text-white hover:text-red-200"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2"><User size={16}/> Personal Information</h3>
                        
                        {/* Branch Selection for Super Admin */}
                        {user?.role === 'Super Admin' && (
                          <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-100">
                               <label className="block text-xs font-bold text-blue-800 mb-1">Assign Branch *</label>
                               <select {...register('branchId', {required: "Branch is Required"})} className="w-full border border-blue-300 p-2 rounded text-sm bg-white">
                                   <option value="">-- Select Branch --</option>
                                   {branches.map(b => (
                                       <option key={b._id} value={b._id}>{b.name} ({b.shortCode})</option>
                                   ))}
                               </select>
                               {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Full Name *</label>
                                <input 
                                    {...register('name', {required:true})} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('name', formatInputText(e.target.value))}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700">Mobile Number *</label>
                                <input {...register('mobile', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Email *</label>
                                <input {...register('email', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Gender</label>
                                <select {...register('gender', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Type (Role) *</label>
                                <select {...register('type', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                    <option>Faculty</option><option>Manager</option><option>Marketing Person</option><option>Branch Director</option><option>Receptionist</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Joining</label>
                                <input type="date" {...register('dateOfJoining')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700">Duration</label>
                                <input 
                                    {...register('duration')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('duration', formatInputText(e.target.value))}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <input 
                                    {...register('address')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('address', formatInputText(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <input 
                                    {...register('education')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('education', formatInputText(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Qualification</label>
                                <input 
                                    {...register('qualification')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('qualification', formatInputText(e.target.value))}
                                />
                            </div>
                            <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
                                <ProfileImageUploader
                                    value={previewImage}
                                    onChange={(file) => {
                                        setPhotoFile(file);
                                        setPreviewImage(URL.createObjectURL(file));
                                    }}
                                    onDelete={() => {
                                        setPhotoFile(null);
                                        setPreviewImage(null);
                                    }}
                                    onProcessingChange={(processing) => setIsImageProcessing(processing)}
                                    size="w-20 h-20"
                                    name="photo"
                                />
                                <span className="text-xs text-gray-500 mt-2">Passport Size Photo</span>
                            </div>
                            <label className="flex items-center gap-2 mt-2 col-span-2">
                                <input type="checkbox" {...register('isActive')} defaultChecked className="w-4 h-4"/>
                                <span className="text-sm text-gray-700 font-semibold">Employee is Active</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2"><Briefcase size={16}/> Work Experience Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Experience</label>
                                <input 
                                    {...register('experience')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('experience', formatInputText(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Working Time Period</label>
                                <input 
                                    {...register('workingTimePeriod')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('workingTimePeriod', formatInputText(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Company Name</label>
                                <input 
                                    {...register('companyName')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('companyName', formatInputText(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Role</label>
                                <input 
                                    {...register('role')} 
                                    className="w-full border p-2 rounded text-sm mt-1"
                                    onChange={(e) => setValue('role', formatInputText(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {!(editMode && watchType === 'Branch Director') && (
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                            <div className="flex justify-between items-center border-b border-yellow-300 pb-2 mb-4">
                                <h3 className="text-sm font-bold text-yellow-800 uppercase flex items-center gap-2"><Lock size={16}/> Login Details</h3>
                                {!editMode && <span className="text-[10px] bg-yellow-200 px-2 py-1 rounded text-yellow-800">Auto-Generated</span>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-xs font-bold text-gray-700">Login Username</label><input {...register('loginUsername')} readOnly={!editMode} className="w-full border p-2 rounded text-sm mt-1 bg-gray-100 cursor-not-allowed"/></div>
                                <div><label className="block text-xs font-bold text-gray-700">Password</label><input type="text" {...register('loginPassword')} placeholder={editMode ? "Leave empty to keep current" : ""} className="w-full border p-2 rounded text-sm mt-1 bg-white"/></div>
                                <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('isLoginActive')} defaultChecked className="w-4 h-4 text-green-600"/><span className="text-sm font-bold text-gray-700">Login Active?</span></label></div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={closeForm} disabled={isLoading} className="px-6 py-2 border rounded hover:bg-gray-100 text-sm font-medium disabled:opacity-70">Cancel</button>
                        <button type="submit" disabled={isLoading || isSubmitting} className="bg-primary text-white px-8 py-2 rounded hover:bg-blue-800 shadow text-sm font-bold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                             {isLoading || isSubmitting ? <Loader className="animate-spin" size={16}/> : null}
                             {isLoading || isSubmitting ? 'Saving...' : (editMode ? "Update Employee" : "Save Employee")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMaster;