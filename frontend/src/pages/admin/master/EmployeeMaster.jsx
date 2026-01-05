import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, resetEmployeeStatus } from '../../../features/employee/employeeSlice';
import { toast } from 'react-toastify';
import { Search, Plus, X, Upload, User, Briefcase, Lock, Trash2, Edit } from 'lucide-react';

const EmployeeMaster = () => {
  const dispatch = useDispatch();
  const { employees, isSuccess,isError, message } = useSelector((state) => state.employees);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  // Filters State
  const [filters, setFilters] = useState({
    joiningFrom: '', joiningTo: '', gender: '', searchBy: 'Employee Name', searchValue: ''
  });

  useEffect(() => {
    dispatch(fetchEmployees(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (isError) {
        toast.error(message);
        dispatch(resetEmployeeStatus());
    }
    if (isSuccess && showForm) {
        toast.success("Employee Added Successfully");
        dispatch(resetEmployeeStatus());
        reset();
        setShowForm(false);
        setPreviewImage(null);
    }
  }, [isSuccess, isError, message, showForm, dispatch, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreviewImage(URL.createObjectURL(file));
        setValue('photo', file.name); // Mock upload
    }
  };

  const onSubmit = (data) => {
    dispatch(createEmployee(data));
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Header & Add Button --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Employees</h1>
        <button 
            onClick={() => setShowForm(true)} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg text-sm font-bold"
        >
            <Plus size={20}/> Add New Employee
        </button>
      </div>

      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Filter Employees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div>
                <label className="text-xs text-gray-500 font-semibold">Joining From</label>
                <input type="date" value={filters.joiningFrom} onChange={e => setFilters({...filters, joiningFrom: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">To Date</label>
                <input type="date" value={filters.joiningTo} onChange={e => setFilters({...filters, joiningTo: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Gender</label>
                <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Search By</label>
                <select value={filters.searchBy} onChange={e => setFilters({...filters, searchBy: e.target.value})} className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option>Employee Name</option>
                    <option>Employee Mobile</option>
                    <option>Employee Email</option>
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Value</label>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={filters.searchValue} 
                    onChange={e => setFilters({...filters, searchValue: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div>
                <button onClick={() => dispatch(fetchEmployees(filters))} className="bg-primary text-white w-full py-2 rounded shadow hover:bg-blue-800 text-sm font-bold">
                    Search
                </button>
            </div>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 w-10"><input type="checkbox"/></th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Employee Name</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Mobile</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Username</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Status</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3"><input type="checkbox"/></td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                            {emp.name}
                            <span className="block text-xs text-gray-400">{emp.type}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{emp.mobile}</td>
                        <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{emp.loginUsername || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                             {emp.isActive ? 
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span> : 
                                <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">INACTIVE</span>
                            }
                        </td>
                        <td className="px-4 py-3 text-right flex justify-end gap-2">
                            <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                            <button className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" className="text-center py-8 text-gray-400">No employees found</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- Add Employee Modal --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2"><User size={20}/> Add New Employee</h2>
                    <button onClick={() => setShowForm(false)} className="text-white hover:text-red-200"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    
                    {/* SECTION 1: Personal Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2">
                            <User size={16}/> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Full Name *</label>
                                <input {...register('name', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
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
                                    <option>Male</option><option>Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Type *</label>
                                <select {...register('type', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                    <option>Faculty</option>
                                    <option>Manager</option>
                                    <option>Marketing Person</option>
                                    <option>Branch Director</option>
                                    <option>Receptionist</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700">Duration</label>
                                <input {...register('duration')} className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 1 Year"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <input {...register('address')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <input {...register('education')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Qualification</label>
                                <input {...register('qualification')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            
                            {/* Photo Drag & Drop Mock */}
                            <div className="md:col-span-4 border-2 border-dashed border-gray-300 rounded p-4 flex flex-col items-center bg-gray-50">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="h-20 w-20 rounded-full object-cover mb-2"/>
                                ) : (
                                    <Upload className="text-gray-400 mb-2"/>
                                )}
                                <label className="cursor-pointer text-blue-600 text-xs font-bold hover:underline">
                                    Drag & Drop Photo or Click to Upload
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                                </label>
                            </div>
                            
                            <label className="flex items-center gap-2 mt-2">
                                <input type="checkbox" {...register('isActive')} defaultChecked className="w-4 h-4"/>
                                <span className="text-sm text-gray-700">Is Active?</span>
                            </label>
                        </div>
                    </div>

                    {/* SECTION 2: Work Experience */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2">
                            <Briefcase size={16}/> Work Experience Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Experience</label>
                                <input {...register('experience')} className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 2 Years"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Time Period</label>
                                <input {...register('workingTimePeriod')} className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. 2020-2022"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Company Name</label>
                                <input {...register('companyName')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Role</label>
                                <input {...register('role')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Login Details */}
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                        <h3 className="text-sm font-bold text-yellow-800 border-b border-yellow-300 pb-2 mb-4 uppercase flex items-center gap-2">
                            <Lock size={16}/> Login Details (Create User)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Login Username / Email</label>
                                <input {...register('loginUsername')} className="w-full border p-2 rounded text-sm mt-1 bg-white"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Password</label>
                                <input type="password" {...register('loginPassword')} className="w-full border p-2 rounded text-sm mt-1 bg-white"/>
                            </div>
                            <div className="flex items-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('isLoginActive')} defaultChecked className="w-4 h-4 text-green-600"/>
                                    <span className="text-sm font-bold text-gray-700">Login Active?</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded hover:bg-gray-100 text-sm font-medium">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-8 py-2 rounded hover:bg-blue-800 shadow text-sm font-bold">Save Employee</button>
                    </div>

                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default EmployeeMaster;