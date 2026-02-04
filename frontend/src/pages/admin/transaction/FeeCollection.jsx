import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { collectFees, fetchFeeReceipts, updateFeeReceipt, deleteFeeReceipt, resetTransaction } from '../../../features/transaction/transactionSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, RotateCcw, FileText, Printer, Edit2, Trash2, Eye, Save, X, DollarSign, Calendar, Receipt } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import StudentSearch from '../../../components/StudentSearch';
import ReceiptPrintTemplate from '../../../components/ReceiptPrintTemplate';
import moment from 'moment';
import EditReceiptModal from '../../../components/transaction/EditReceiptModal';
import { useLocation } from 'react-router-dom';

const FeeCollection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { receipts, isSuccess, message, isLoading } = useSelector(state => state.transaction);
    
    const [editingReceipt, setEditingReceipt] = useState(null);
    const [printingReceipt, setPrintingReceipt] = useState(null);
    
    // Student-related states
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paymentSummary, setPaymentSummary] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    
    const receiptRef = useRef();

    const { register, handleSubmit, reset, setValue, control, watch } = useForm({
        defaultValues: {
            receiptNo: 'Loading...',
            date: new Date().toISOString().split('T')[0],
            paymentMode: 'Cash'
        }
    });

    // Fetch next receipt number on mount
    useEffect(() => {
        fetchNextReceiptNo();
        
        // Check if we navigated here with a receipt to edit
        if (location.state?.editReceipt) {
            handleEdit(location.state.editReceipt);
            // Clear state so it doesn't reopen on refresh? 
            // Actually, manipulating history state is tricky without a library, but this is fine for now. 
            // We can just rely on the user closing it.
             window.history.replaceState({}, document.title); // Clean up state
        }
    }, [location.state]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            dispatch(resetTransaction());
            
            // Refresh student data if a student is selected
            if (selectedStudent) {
                fetchStudentPaymentData(selectedStudent._id);
            } else {
                // If no student selected (after creating new receipt), reset form
                resetForm();
                fetchNextReceiptNo();
            }
        }
    }, [isSuccess, message, dispatch, selectedStudent]);

    const fetchNextReceiptNo = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/fees/next-no`, {
                withCredentials: true
            });
            setValue('receiptNo', data);
        } catch (error) {
            console.error("Failed to fetch next receipt no", error);
            setValue('receiptNo', 'Error');
        }
    };

    const fetchStudentPaymentData = async (studentId) => {
        try {
            // Fetch payment summary
            const { data: summary } = await axios.get(
                `${import.meta.env.VITE_API_URL}/transaction/student/${studentId}/payment-summary`,
                { withCredentials: true }
            );
            setPaymentSummary(summary);

            // Fetch payment history
            const { data: history } = await axios.get(
                `${import.meta.env.VITE_API_URL}/transaction/student/${studentId}/payment-history`,
                { withCredentials: true }
            );
            setPaymentHistory(history);

            // Auto-fill amount with outstanding amount
            setValue('amountPaid', summary.outstandingAmount || 0);
        } catch (error) {
            console.error("Failed to fetch student payment data", error);
            toast.error("Failed to load student payment information");
        }
    };

    const handleStudentSelect = (id, student) => {
        setSelectedStudent(student);
        if (student) {
            setValue('studentId', id);
            setValue('courseName', student.course?.name || 'N/A');
            fetchStudentPaymentData(id);
        } else {
            setSelectedStudent(null);
            setPaymentSummary(null);
            setPaymentHistory([]);
            setValue('studentId', '');
            setValue('courseName', '');
            setValue('amountPaid', '');
        }
    };

    const resetForm = () => {
        reset({
            receiptNo: 'Loading...',
            date: new Date().toISOString().split('T')[0],
            paymentMode: 'Cash'
        });
        setSelectedStudent(null);
        setPaymentSummary(null);
        setPaymentHistory([]);
        setEditingReceipt(null);
        fetchNextReceiptNo();
    };

    const onSubmit = (data) => {
        if (!selectedStudent) {
            toast.error("Please select a student");
            return;
        }

        const payload = {
            ...data,
            studentId: data.studentId,
            courseId: selectedStudent.course?._id,
        };

        if (editingReceipt) {
            dispatch(updateFeeReceipt({ id: editingReceipt._id, data: payload }));
        } else {
            dispatch(collectFees(payload));
        }
    };

    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (receipt) => {
        setEditingReceipt(receipt);
        setShowEditModal(true);
    };

    const handleCancelEdit = () => {
        setShowEditModal(false);
        setEditingReceipt(null);
    };

    const onReceiptUpdateSuccess = () => {
        if (selectedStudent) {
            fetchStudentPaymentData(selectedStudent._id);
        }
    };
    
    // handleUpdateReceipt and redundant editFormData removed here as they are handled in EditReceiptModal

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this receipt?')) {
            dispatch(deleteFeeReceipt(id));
        }
    };

    // --- Filter & Report Handlers Removed (Moved to AllReceipts) ---

    // --- Printing ---
    const handlePrintReceipt = useReactToPrint({
        contentRef: receiptRef,
        onAfterPrint: () => setPrintingReceipt(null)
    });

    const triggerPrintReceipt = (receipt) => {
        setPrintingReceipt(receipt);
        setTimeout(() => {
            handlePrintReceipt();
        }, 100);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600"/> Fees Receipt Management
            </h1>

            {/* === NEW RECEIPT FORM === */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Receipt className="text-indigo-600"/> {editingReceipt ? 'Edit Receipt' : 'New Receipt'}
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Receipt Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Receipt Number</label>
                        <input 
                            type="text" 
                            {...register('receiptNo')} 
                            readOnly 
                            className="w-full border bg-gray-100 text-gray-500 rounded-lg p-3 cursor-not-allowed text-base"
                        />
                    </div>

                    {/* Receipt Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Receipt Date</label>
                        <input 
                            type="date" 
                            {...register('date', { required: true })} 
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                        />
                    </div>

                    {/* Payment Mode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Payment Mode</label>
                        <select 
                            {...register('paymentMode', { required: true })} 
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online/UPI">Online/UPI</option>
                        </select>
                    </div>

                    {/* Dynamic Fields for Cash/Cheque/UPI in Main Form */}
                    {watch('paymentMode') === 'Cheque' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name *</label>
                                <input {...register('bankName', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base" placeholder="Bank Name"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Cheque Number *</label>
                                <input {...register('chequeNumber', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base" placeholder="Cheque No"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Cheque Date *</label>
                                <input type="date" {...register('chequeDate', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"/>
                            </div>
                        </>
                    )}

                    {watch('paymentMode') === 'Online/UPI' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name *</label>
                                <input {...register('bankName', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base" placeholder="Bank Name"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Transaction Number *</label>
                                <input {...register('transactionId', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base" placeholder="Trans ID"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Transaction Date *</label>
                                <input type="date" {...register('transactionDate', { required: true })} className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"/>
                            </div>
                        </>
                    )}

                    {/* Student Name */}
                    <div>
                        <Controller
                            name="studentId"
                            control={control}
                            rules={{ required: "Student is required" }}
                            render={({ field, fieldState: { error } }) => (
                                <StudentSearch 
                                    label="Student Name"
                                    required
                                    error={error?.message}
                                    onSelect={handleStudentSelect}
                                    placeholder="Search student..."
                                    additionalFilters={{ hasPendingFees: 'true' }}
                                />
                            )}
                        />
                    </div>

                    {/* Course */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                        <input 
                            type="text" 
                            {...register('courseName')} 
                            readOnly 
                            placeholder="Auto-filled"
                            className="w-full border bg-gray-100 rounded-lg p-3 outline-none text-gray-600 text-base"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Amount (₹)</label>
                        <input 
                            type="number" 
                            {...register('amountPaid', { required: true })} 
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-base"
                            placeholder="Enter amount"
                        />
                         {paymentSummary && (
                            <p className="text-xs text-red-500 mt-1 font-semibold">
                                Outstanding: ₹{paymentSummary.outstandingAmount} | Total Due: ₹{paymentSummary.dueAmount}
                            </p>
                        )}
                    </div>

                    {/* Remark */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Remark</label>
                        <textarea 
                            {...register('remarks')} 
                            rows="2"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base"
                            placeholder="Optional notes"
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                            {isLoading ? <RotateCcw className="animate-spin" size={16}/> : <Save size={16}/>} 
                            {isLoading ? 'Saving...' : (editingReceipt ? 'Update' : 'Save')}
                        </button>
                        <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm font-medium">
                            <RotateCcw size={16}/> Reset
                        </button>
                        <button type="button" onClick={() => navigate('/transaction/all-receipts')} className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                            <Eye size={16}/> View All Receipts
                        </button>
                    </div>
                </form>
            </div>

            {/* === STUDENT PAYMENT SECTIONS (Shown when student is selected) === */}
            {selectedStudent && paymentSummary && (
                <>
                    {/* Section 1: Receive Detail Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mb-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <DollarSign className="text-green-600"/> Receive Detail
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase mb-1">Total Received</p>
                                <p className="text-2xl font-bold text-green-600">₹ {paymentSummary.totalReceived?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase mb-1">Due Amount</p>
                                <p className="text-2xl font-bold text-orange-600">₹ {paymentSummary.dueAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase mb-1">Outstanding Amount</p>
                                <p className="text-2xl font-bold text-red-600">₹ {paymentSummary.outstandingAmount?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase mb-1">Fees Method</p>
                                <p className="text-lg font-bold text-blue-600">{paymentSummary.feesMethod}</p>
                                {paymentSummary.emiStructure && (
                                    <p className="text-sm text-gray-600 mt-1">{paymentSummary.emiStructure}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Fees Details Table */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Calendar className="text-purple-600"/> Fees Details / Payment History
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100/60 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="p-3 font-semibold border-b">Receipt Date</th>
                                        <th className="p-3 font-semibold border-b">Receipt Number</th>
                                        <th className="p-3 font-semibold border-b">Installment No.</th>
                                        <th className="p-3 font-semibold border-b text-right">Amount (₹)</th>
                                        <th className="p-3 font-semibold border-b">Payment Mode</th>
                                        <th className="p-3 font-semibold border-b text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {paymentHistory.length > 0 ? (
                                        paymentHistory.map((receipt) => (
                                            <tr key={receipt._id} className="border-b hover:bg-blue-50/40 transition">
                                                <td className="p-3">{moment(receipt.date).format('DD/MM/YYYY')}</td>
                                                <td className="p-3 font-mono text-gray-500">{receipt.receiptNo}</td>
                                                <td className="p-3">
                                                    {(() => {
                                                        // Check remarks field for admission/registration keywords
                                                        const remark = (receipt.remarks || '').toLowerCase();
                                                        const isAdmission = remark.includes('admission');
                                                        const isRegistration = remark.includes('registration');
                                                        
                                                        if (isAdmission) {
                                                            return (
                                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                                                    Admission Fees
                                                                </span>
                                                            );
                                                        } else if (isRegistration) {
                                                            return (
                                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                                                                    Registration Fees
                                                                </span>
                                                            );
                                                        } else if (receipt.installmentNumber === 1) {
                                                            return (
                                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                                                    Admission Fees
                                                                </span>
                                                            );
                                                        } else if (receipt.installmentNumber === 2) {
                                                            return (
                                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                                                                    Registration Fees
                                                                </span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                                    Installment {receipt.installmentNumber || 1}
                                                                </span>
                                                            );
                                                        }
                                                    })()}
                                                </td>
                                                <td className="p-3 text-right font-medium">{receipt.amountPaid}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                                                        ${receipt.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' : 
                                                          receipt.paymentMode === 'Online/UPI' ? 'bg-blue-100 text-blue-700' : 
                                                          'bg-orange-100 text-orange-700'}`}>
                                                        {receipt.paymentMode}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => triggerPrintReceipt(receipt)}
                                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" 
                                                        title="Print"
                                                    >
                                                        <Printer size={16}/>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEdit(receipt)}
                                                        className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-400">No payment history found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* === HIDDEN PRINT TEMPLATES === */}
            <div className="hidden">
                <ReceiptPrintTemplate ref={receiptRef} receipt={printingReceipt} />
            </div>

            {/* === EDIT RECEIPT MODAL === */}
            <EditReceiptModal 
                isOpen={showEditModal}
                onClose={handleCancelEdit}
                receipt={editingReceipt}
                onUpdateSuccess={onReceiptUpdateSuccess}
            />
        </div>
    );
};

export default FeeCollection;