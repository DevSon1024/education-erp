import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../../features/employee/employeeSlice';
import { fetchUserRights, saveUserRights, resetRightsState } from '../../../features/userRights/userRightsSlice';
import { toast } from 'react-toastify';
import { Save, RefreshCw, CheckSquare, Square } from 'lucide-react';

// Map Menu Titles to the specific Page Names used in the DB
const SECTIONS = {
  'Master': ['Student', 'Employee', 'Batch', 'Course', 'Subject', 'User Rights'],
  'Transaction': ['Admission', 'Fees Receipt', 'Attendance', 'Inquiry'],
  'Reports': ['Ledger', 'Monthly Report', 'Admission Form'],
  'Blog': ['Manage Blogs', 'Comments'],
  'Connect': ['Video Call', 'Inquiry List'],
  'Utility': ['Downloads', 'Free Learning']
};

const TEMPLATES = {
  'Manager': { view: true, add: true, edit: true, delete: false },
  'Teacher': { view: true, add: true, edit: false, delete: false },
  'Receptionist': { view: true, add: true, edit: false, delete: false },
  'Super Admin': { view: true, add: true, edit: true, delete: true },
};

const UserRights = () => {
  const dispatch = useDispatch();
  
  // Local State
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState('Master'); // Default Tab

  // Redux State
  const { employees } = useSelector((state) => state.employees);
  const { rights, isSuccess, message } = useSelector((state) => state.userRights);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
      toast.success(message);
      dispatch(resetRightsState());
    }
  }, [isSuccess, message, dispatch]);

  // Load existing rights when fetched from backend
  useEffect(() => {
    if (rights && rights.permissions) {
      // Flatten all pages from SECTIONS to ensure we have a complete list
      const allPages = Object.values(SECTIONS).flat();
      
      const mergedPermissions = allPages.map(page => {
        const existing = rights.permissions.find(p => p.page === page);
        return existing || { page, view: false, add: false, edit: false, delete: false };
      });
      setPermissions(mergedPermissions);
    }
  }, [rights]);

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) {
      const employee = employees.find(emp => emp._id === empId);
      if (employee && employee.userAccount) {
        dispatch(fetchUserRights(employee.userAccount));
      } else {
        toast.warning("This employee is not linked to a User Account.");
        setPermissions([]);
      }
    }
  };

  const handleTemplateChange = (e) => {
    const templateName = e.target.value;
    if (templateName && TEMPLATES[templateName]) {
      const tmpl = TEMPLATES[templateName];
      const newPerms = permissions.map(p => ({
        ...p,
        view: tmpl.view,
        add: tmpl.add,
        edit: tmpl.edit,
        delete: tmpl.delete
      }));
      setPermissions(newPerms);
    }
  };

  // Toggle specific checkbox
  const handleCheckboxChange = (pageName, field, value) => {
    setPermissions(prev => prev.map(p => 
      p.page === pageName ? { ...p, [field]: value } : p
    ));
  };

  // Select all options for a specific row (Page)
  const handleRowSelectAll = (pageName, isChecked) => {
    setPermissions(prev => prev.map(p => 
      p.page === pageName ? { 
        ...p, 
        view: isChecked, add: isChecked, edit: isChecked, delete: isChecked 
      } : p
    ));
  };

  // Select all options for a specific column (Action) - ONLY FOR CURRENT TAB
  const handleColumnSelectAll = (field, isChecked) => {
    const visiblePages = SECTIONS[activeTab];
    setPermissions(prev => prev.map(p => {
      if (visiblePages.includes(p.page)) {
        return { ...p, [field]: isChecked };
      }
      return p;
    }));
  };

  const onSave = () => {
    const employee = employees.find(emp => emp._id === selectedEmployee);
    if (employee && employee.userAccount) {
      dispatch(saveUserRights({ userId: employee.userAccount, permissions }));
    }
  };

  // Filter permissions based on active tab
  const visiblePermissions = permissions.filter(p => SECTIONS[activeTab]?.includes(p.page));

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Rights Management</h2>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end border-t-4 border-primary">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
          <select 
            className="w-full border rounded p-2"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.type})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Apply Template</label>
          <select className="w-full border rounded p-2" onChange={handleTemplateChange}>
            <option value="">-- Custom --</option>
            {Object.keys(TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button 
          onClick={() => {
             // Reset all to full permissions? Or just fetch again? 
             // Currently just setting everything to true for demo
             setPermissions(prev => prev.map(p => ({ ...p, view: true, add: true, edit: true, delete: true })))
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center gap-2"
        >
          <RefreshCw size={18}/> Grant All
        </button>
      </div>

      {selectedEmployee && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          
          {/* Tabs Section */}
          <div className="flex overflow-x-auto bg-gray-50 border-b scrollbar-hide">
            {Object.keys(SECTIONS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab 
                    ? 'border-primary text-primary bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rights Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Page Name
                  </th>
                  {['view', 'add', 'edit', 'delete'].map(action => (
                    <th key={action} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col items-center gap-2 cursor-pointer group"
                           onClick={() => {
                             // Check if all visible rows have this action checked
                             const allChecked = visiblePermissions.every(p => p[action]);
                             handleColumnSelectAll(action, !allChecked);
                           }}
                      >
                        <span className="group-hover:text-primary transition-colors">{action}</span>
                        {/* Visual indicator for Column Select All */}
                         {visiblePermissions.length > 0 && visiblePermissions.every(p => p[action]) 
                           ? <CheckSquare size={16} className="text-primary"/> 
                           : <Square size={16} className="text-gray-400"/>
                         }
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select All
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visiblePermissions.length > 0 ? (
                  visiblePermissions.map((perm) => (
                    <tr key={perm.page} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                        {perm.page}
                      </td>
                      {['view', 'add', 'edit', 'delete'].map(action => (
                        <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox"
                            checked={perm[action]}
                            onChange={(e) => handleCheckboxChange(perm.page, action, e.target.checked)}
                            className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer transition-all"
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input 
                          type="checkbox"
                          checked={perm.view && perm.add && perm.edit && perm.delete}
                          onChange={(e) => handleRowSelectAll(perm.page, e.target.checked)}
                          className="h-5 w-5 text-accent focus:ring-accent border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                      No configurable pages found for this section.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t flex justify-between items-center bg-gray-50">
            <span className="text-xs text-gray-500">
              * Configure rights for <b>{activeTab}</b> section. Don't forget to save.
            </span>
            <button 
              onClick={onSave}
              className="bg-green-600 text-white px-8 py-2.5 rounded shadow hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRights;