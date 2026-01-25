import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { collectFees, fetchFeeReceipts, updateFeeReceipt, deleteFeeReceipt, resetTransaction } from '../../../features/transaction/transactionSlice';
import axios from 'axios'; // Import axios for direct call
import { toast } from 'react-toastify';
import { Search, RotateCcw, FileText, Printer, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import StudentSearch from '../../../components/StudentSearch';
import moment from 'moment';

const FeeCollection = () => {
    const dispatch = useDispatch();
    const { receipts, isSuccess, message } = useSelector(state => state.transaction);
    // Removed students slice dependency as we now search dynamically
    
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentReceiptId, setCurrentReceiptId] = useState(null);
    const [printingReceipt, setPrintingReceipt] = useState(null);
    const [initialEditStudentId, setInitialEditStudentId] = useState(null); // For StudentSearch in Edit Mode
    const [formStudentObj, setFormStudentObj] = useState(null); // To store selected student object in form to get course etc.
    const receiptRef = useRef();

    // Filters State
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        receiptNo: '',
        paymentMode: '',
        studentId: '' // For dropdown/search
    });

    const { register, handleSubmit, reset, setValue, control, watch } = useForm();
    
    // We no longer need to watch studentId for course autofill via effect, 
    // because we handle it directly in onSelect of StudentSearch.

    useEffect(() => {
        dispatch(fetchFeeReceipts());
        // dispatch(fetchStudents()); // REMOVED: Optimization
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            dispatch(resetTransaction());
            if (showModal) {
                closeModal();
                dispatch(fetchFeeReceipts(filters)); // Refresh list
            }
        }
    }, [isSuccess, message, dispatch, showModal, filters]);

    // --- Search & Filter Handlers ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        dispatch(fetchFeeReceipts(filters));
    };

    const resetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            receiptNo: '',
            paymentMode: '',
            studentId: ''
        });
        dispatch(fetchFeeReceipts());
    };

    // --- Form Handlers ---
    const openAddModal = async () => {
        setEditMode(false);
        setInitialEditStudentId(null);
        setFormStudentObj(null);
        
        let nextReceiptNo = 'Loading...';
        try {
            // Fetch Next Receipt No
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/fees/next-no`, {
                withCredentials: true
            });
            nextReceiptNo = data;
        } catch (error) {
            console.error("Failed to fetch next receipt no", error);
            nextReceiptNo = 'Error';
        }

        reset({
            receiptNo: nextReceiptNo, 
            date: new Date().toISOString().split('T')[0],
            paymentMode: 'Cash'
        });
        setShowModal(true);
    };

    const openEditModal = (receipt) => {
        setEditMode(true);
        setCurrentReceiptId(receipt._id);
        setInitialEditStudentId(receipt.student?._id); // Set initial ID for search component
        setFormStudentObj(receipt.student); // Pre-fill student obj just in case
        
        // Populate form
        setValue('receiptNo', receipt.receiptNo);
        setValue('date', receipt.date?.split('T')[0]);
        setValue('studentId', receipt.student?._id);
        setValue('amountPaid', receipt.amountPaid);
        setValue('paymentMode', receipt.paymentMode);
        setValue('remarks', receipt.remarks);
        setValue('courseName', receipt.course?.name);

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setInitialEditStudentId(null);
        setFormStudentObj(null);
        reset();
    };

    const onSubmit = (data) => {
        if(editMode) {
            dispatch(updateFeeReceipt({ id: currentReceiptId, data }));
        } else {
            // Use local state formStudentObj to get course ID
            // If user searched and selected, formStudentObj is set.
            const courseId = formStudentObj?.course?._id;
            
            if(!courseId) {
                toast.error("Could not determine student course. Please re-select student.");
                return;
            }

            const payload = { ...data, courseId };
            dispatch(collectFees(payload));
        }
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this receipt?')) {
            dispatch(deleteFeeReceipt(id));
        }
    };

    // --- Printing ---
    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
        onAfterPrint: () => setPrintingReceipt(null)
    });

    const triggerPrint = (receipt) => {
        setPrintingReceipt(receipt);
        // Small delay to allow state to update before printing
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    return (
        <div className="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-blue-600"/> Manage Fees Receipt
            </h1>

            {/* --- Filter Section --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        {/* REPLACED: Dropdown with Search */}
                        <StudentSearch 
                            label="Student"
                            onSelect={(id) => setFilters(prev => ({ ...prev, studentId: id }))}
                            placeholder="Search Student..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Receipt Type</label>
                        <select 
                            name="paymentMode" 
                            value={filters.paymentMode} 
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online">Online</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                    <div className="relative">
                         <label className="block text-sm font-medium text-gray-600 mb-1">Receipt No</label>
                         <input 
                            type="text" 
                            name="receiptNo" 
                            value={filters.receiptNo} 
                            onChange={handleFilterChange}
                            placeholder="REC-1001"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none pl-9"
                         />
                         <Search size={16} className="absolute left-3 top-9 text-gray-400" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">From Date</label>
                        <input 
                            type="date" 
                            name="startDate" 
                            value={filters.startDate} 
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">To Date</label>
                        <input 
                            type="date" 
                            name="endDate" 
                            value={filters.endDate} 
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-4 justify-end">
                    <button onClick={applyFilters} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Search size={16}/> Search
                    </button>
                    <button onClick={resetFilters} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm font-medium">
                        <RotateCcw size={16}/> Reset
                    </button>
                     {/* Placeholder for Report Logic */}
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                        <FileText size={16}/> Report
                    </button>
                </div>
            </div>

            {/* --- Action Bar & Table --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-semibold text-gray-700">Receipt List / Passbook</h2>
                    <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Plus size={18}/> Add New Receipt
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100/60 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold border-b">Date</th>
                                <th className="p-4 font-semibold border-b">Receipt No</th>
                                <th className="p-4 font-semibold border-b">Student Name</th>
                                <th className="p-4 font-semibold border-b">Course</th>
                                <th className="p-4 font-semibold border-b">Type</th>
                                <th className="p-4 font-semibold border-b text-right">Amount (₹)</th>
                                <th className="p-4 font-semibold border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {receipts && receipts.length > 0 ? (
                                receipts.map((receipt) => (
                                    <tr key={receipt._id} className="border-b hover:bg-blue-50/40 transition">
                                        <td className="p-4">{moment(receipt.date).format('DD/MM/YYYY')}</td>
                                        <td className="p-4 font-mono text-gray-500">{receipt.receiptNo}</td>
                                        <td className="p-4 font-medium text-gray-900">
                                            {receipt.student?.firstName} {receipt.student?.lastName}
                                        </td>
                                        <td className="p-4">{receipt.course?.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold 
                                                ${receipt.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' : 
                                                  receipt.paymentMode === 'Online' || receipt.paymentMode === 'UPI' ? 'bg-blue-100 text-blue-700' : 
                                                  'bg-orange-100 text-orange-700'}`}>
                                                {receipt.paymentMode}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium">{receipt.amountPaid}</td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <button 
                                                onClick={() => triggerPrint(receipt)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" 
                                                title="Print"
                                            >
                                                <Printer size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(receipt)}
                                                className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                                                title="Edit"
                                            >
                                                <Edit2 size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(receipt._id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">No receipts found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Add/Edit Modal --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                        <button onClick={closeModal} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition">
                            <X size={24}/>
                        </button>
                        
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            {editMode ? 'Edit Receipt' : 'Add New Receipt'}
                        </h2>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Receipt No</label>
                                    <input 
                                        type="text" 
                                        {...register('receiptNo')} 
                                        readOnly 
                                        className="w-full border bg-gray-100 text-gray-500 rounded-lg p-2.5 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        {...register('date', { required: true })} 
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    {/* REPLACED: Dropdown with Search */}
                                    <Controller
                                        name="studentId"
                                        control={control}
                                        rules={{ required: "Student is required" }}
                                        render={({ field, fieldState: { error } }) => (
                                            <StudentSearch 
                                                label="Student Name"
                                                required
                                                defaultSelectedId={initialEditStudentId} // Only pass when editing
                                                error={error?.message}
                                                onSelect={(id, student) => {
                                                    field.onChange(id);
                                                    if(student) {
                                                        setFormStudentObj(student);
                                                        setValue('courseName', student.course?.name || 'N/A');
                                                    } else {
                                                        setFormStudentObj(null);
                                                        setValue('courseName', '');
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course Name</label>
                                    <input 
                                        type="text" 
                                        {...register('courseName')} 
                                        readOnly 
                                        placeholder="Auto Selects"
                                        className="w-full border bg-gray-100 rounded-lg p-2.5 outline-none text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        {...register('amountPaid', { required: true })} 
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Receipt Type</label>
                                    <select 
                                        {...register('paymentMode', { required: true })} 
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Online">Online</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
                                <textarea 
                                    {...register('remarks')} 
                                    rows="2"
                                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition">Cancel</button>
                                <button type="submit" className="flex-1 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition shadow-md">
                                    {editMode ? 'Update Receipt' : 'Save Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Hidden Printable Receipt --- */}
            <div className="hidden">
                 <div ref={receiptRef} className="p-8 bg-white text-gray-800" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {printingReceipt && (
                        <div className="border border-gray-800 p-6 max-w-2xl mx-auto">
                            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                                <h1 className="text-2xl font-bold uppercase tracking-wider">Education ERP Institute</h1>
                                <p className="text-sm text-gray-600">Address Line 1, City, State - Zip Code</p>
                                <p className="text-sm text-gray-600">Phone: 1234567890 | Email: info@college.edu</p>
                                <h2 className="text-xl font-semibold mt-4 bg-gray-800 text-white inline-block px-8 py-1 rounded-full">FEE RECEIPT</h2>
                            </div>
                            
                            <div className="flex justify-between mb-4 text-sm">
                                <div>
                                    <p><strong>Receipt No:</strong> {printingReceipt.receiptNo}</p>
                                    <p><strong>Date:</strong> {moment(printingReceipt.date).format('DD/MM/YYYY')}</p>
                                </div>
                                <div className="text-right">
                                    <p><strong>Student ID:</strong> {printingReceipt.student?.regNo}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-dashed border-gray-400 pb-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Received From</p>
                                    <p className="font-bold text-lg">{printingReceipt.student?.firstName} {printingReceipt.student?.lastName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase">Course</p>
                                    <p className="font-semibold">{printingReceipt.course?.name}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                            <th className="p-2">Description</th>
                                            <th className="p-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-2">Tuition / Admission Fees</td>
                                            <td className="p-2 text-right font-mono font-bold">₹ {printingReceipt.amountPaid}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-end mt-12">
                                <div>
                                    <p><strong>Payment Mode:</strong> {printingReceipt.paymentMode}</p>
                                    {printingReceipt.remarks && <p className="text-xs text-gray-500 mt-1 max-w-xs">{printingReceipt.remarks}</p>}
                                </div>
                                <div className="text-center">
                                    <div className="h-12 w-32 border-b border-gray-400 mb-2"></div>
                                    <p className="text-xs font-semibold uppercase">Authorized Signatory</p>
                                </div>
                            </div>
                            
                            <div className="mt-8 text-center text-xs text-gray-400">
                                This is a computer generated receipt.
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default FeeCollection;