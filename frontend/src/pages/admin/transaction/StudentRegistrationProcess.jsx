import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById, confirmRegistration, resetStatus } from '../../../features/student/studentSlice';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, X } from 'lucide-react';

const StudentRegistrationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStudent: student, isLoading } = useSelector((state) => state.students);
  const { isSuccess, message } = useSelector((state) => state.students); // reusing student slice

  const [step, setStep] = useState(1); // 1: Details & Reg Form, 2: Fees (Combined in UI based on prompt)
  
  // Registration Form Data
  const [regData, setRegData] = useState({
    regNo: '', // Optional/Auto
    username: '',
    password: '',
    isActive: true
  });

  // Fee Form Data
  const [feeData, setFeeData] = useState({
    receiptNo: 'Auto',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMode: 'Cash',
    remarks: ''
  });

  useEffect(() => {
    dispatch(fetchStudentById(id));
    return () => dispatch(resetStatus());
  }, [id, dispatch]);

  useEffect(() => {
    if (isSuccess && message === "Student Registration Completed") {
      toast.success(message);
      setTimeout(() => navigate('/master/student'), 1500); // Go to Master List
    } else if (isSuccess === false && message) {
        toast.error(message);
    }
  }, [isSuccess, message, navigate]);

  const handleContinue = (e) => {
    e.preventDefault();
    if(!regData.username || !regData.password) {
        toast.error("Username and Password are required");
        return;
    }
    setStep(2); // Show Fee Section
  };

  const handleFinalSubmit = () => {
    const payload = {
        id: student._id,
        data: {
            ...regData,
            feeDetails: { ...feeData, amount: Number(feeData.amount) || 0 }
        }
    };
    dispatch(confirmRegistration(payload));
  };

  if (!student || isLoading) return <div className="p-6 text-center">Loading Data...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Student Registration Process</h2>
        </div>

        {/* SECTION 1: Student Details (Read Only) */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div><span className="text-gray-500 block">Student Name</span> <span className="font-medium">{student.firstName} {student.lastName}</span></div>
            <div><span className="text-gray-500 block">Father Name</span> <span className="font-medium">{student.middleName}</span></div>
            <div><span className="text-gray-500 block">Admission Date</span> <span className="font-medium">{new Date(student.admissionDate).toLocaleDateString()}</span></div>
            <div><span className="text-gray-500 block">Mobile</span> <span className="font-medium">{student.mobileStudent || student.mobileParent}</span></div>
            <div><span className="text-gray-500 block">Email</span> <span className="font-medium">{student.email || '-'}</span></div>
            <div><span className="text-gray-500 block">Date of Birth</span> <span className="font-medium">{new Date(student.dob).toLocaleDateString()}</span></div>
          </div>
        </div>

        {/* SECTION 2: Registration Details */}
        <div className="p-6">
           <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Details</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Registration No</label>
                 <input 
                    type="text" 
                    placeholder="Auto-Generated if empty" 
                    value={regData.regNo}
                    onChange={(e) => setRegData({...regData, regNo: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                 />
              </div>
              <div className="flex items-center mt-6">
                 <input 
                    type="checkbox" 
                    checked={regData.isActive}
                    onChange={(e) => setRegData({...regData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                 />
                 <label className="ml-2 text-sm text-gray-700">Is Active</label>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    required
                    value={regData.username}
                    onChange={(e) => setRegData({...regData, username: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                 <input 
                    type="password" 
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                 />
              </div>
           </div>
           
           {step === 1 && (
             <div className="mt-6 flex gap-4">
               <button onClick={handleContinue} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Continue</button>
               <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
             </div>
           )}
        </div>

        {/* SECTION 3: Fees Details (Shown after Continue) */}
        {step === 2 && (
          <div className="p-6 border-t animate-fade-in">
             <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Fees Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt No</label>
                    <input type="text" disabled value={feeData.receiptNo} className="w-full bg-gray-100 border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                        type="date" 
                        value={feeData.date} 
                        onChange={(e) => setFeeData({...feeData, date: e.target.value})}
                        className="w-full border rounded px-3 py-2" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                    <input type="text" disabled value={student.course?.name} className="w-full bg-gray-100 border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input 
                        type="number" 
                        value={feeData.amount} 
                        onChange={(e) => setFeeData({...feeData, amount: e.target.value})}
                        placeholder="0.00"
                        className="w-full border rounded px-3 py-2" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Type</label>
                    <select 
                        value={feeData.paymentMode} 
                        onChange={(e) => setFeeData({...feeData, paymentMode: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                    <textarea 
                        value={feeData.remarks} 
                        onChange={(e) => setFeeData({...feeData, remarks: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                        rows="1"
                    ></textarea>
                </div>
             </div>

             <div className="mt-8 flex gap-4">
                <button onClick={handleFinalSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                    <Save size={18} /> Save & Register
                </button>
                <button onClick={() => setStep(1)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                    Cancel
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistrationProcess;