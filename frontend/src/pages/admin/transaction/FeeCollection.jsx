import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchStudents } from '../../../features/student/studentSlice';
import { collectFees, resetTransaction } from '../../../features/transaction/transactionSlice';
import { toast } from 'react-toastify';
import { CreditCard, Search } from 'lucide-react';

const FeeCollection = () => {
    const dispatch = useDispatch();
    const { students } = useSelector(state => state.students);
    const { isSuccess, message } = useSelector(state => state.transaction);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    // Search Student Logic (Simple version)
    const handleSearch = (e) => {
        if(e.key === 'Enter') {
            dispatch(fetchStudents({ keyword: e.target.value }));
        }
    };

    const onSelectStudent = (student) => {
        setSelectedStudent(student);
        setValue('studentId', student._id);
        setValue('courseId', student.course?._id);
    };

    const onSubmit = (data) => {
        dispatch(collectFees(data));
    };

    if (isSuccess) {
        toast.success(message);
        dispatch(resetTransaction());
        reset();
        setSelectedStudent(null);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee Collection</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Search Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
                        <input 
                            type="text" 
                            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Search Student by Name (Press Enter)"
                            onKeyDown={handleSearch}
                        />
                    </div>
                    
                    <div className="mt-4 max-h-60 overflow-y-auto border rounded">
                        {students.map(s => (
                            <div 
                                key={s._id} 
                                onClick={() => onSelectStudent(s)}
                                className={`p-3 border-b cursor-pointer hover:bg-blue-50 flex justify-between ${selectedStudent?._id === s._id ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}
                            >
                                <div>
                                    <p className="font-bold">{s.name}</p>
                                    <p className="text-xs text-gray-500">{s.course?.name}</p>
                                </div>
                                <p className="text-sm font-mono text-gray-600">{s.regNo}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Collection Form */}
                <div className="bg-white p-6 rounded-lg shadow border-t-4 border-green-600">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CreditCard className="text-green-600"/> Payment Details
                    </h2>
                    
                    {selectedStudent ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input type="hidden" {...register('studentId')} />
                            <input type="hidden" {...register('courseId')} />
                            
                            <div className="bg-gray-50 p-3 rounded mb-4">
                                <p className="text-sm text-gray-500">Student: <span className="font-bold text-gray-800">{selectedStudent.name}</span></p>
                                <p className="text-sm text-gray-500">Course: <span className="font-bold text-gray-800">{selectedStudent.course?.name}</span></p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Amount Paid (₹)</label>
                                <input type="number" {...register('amountPaid', { required: true })} className="w-full border p-2 rounded mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Payment Mode</label>
                                <select {...register('paymentMode')} className="w-full border p-2 rounded mt-1">
                                    <option>Cash</option>
                                    <option>UPI</option>
                                    <option>Cheque</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Remarks</label>
                                <input type="text" {...register('remarks')} className="w-full border p-2 rounded mt-1" />
                            </div>

                            <button className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition">
                                Generate Receipt
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            Select a student to collect fees
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeeCollection;