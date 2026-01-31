import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const InquiryViewModal = ({ inquiry, onClose }) => {
    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners destroyed by innerHTML replacement
    };

    if (!inquiry) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm print:hidden">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center print:hidden">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        Inquiry Details
                    </h2>
                    <div className="flex gap-2">
                         <button onClick={handlePrint} className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-1 hover:bg-blue-50 transition">
                            <Printer size={16}/> Print
                        </button>
                        <button onClick={onClose} className="text-white hover:text-red-200 transition"><X size={24}/></button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible" ref={printRef}>
                    
                    {/* Print Header (Only visible when printing or in this view) */}
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-800 text-center uppercase tracking-wide">Inquiry Information</h1>
                        <p className="text-center text-gray-500 text-sm mt-1">Generated on {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        
                        <div className="col-span-2 bg-gray-50 p-2 font-bold text-blue-800 uppercase text-xs tracking-wider border-l-4 border-blue-500">
                            Basic Information
                        </div>

                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Inquiry Date</span>
                            <span className="font-medium text-gray-900">{formatDate(inquiry.inquiryDate)}</span>
                        </div>
                        <div>
                             <span className="block text-gray-500 text-xs uppercase font-semibold">Source</span>
                             <span className="font-medium text-gray-900">{inquiry.source || '-'}</span>
                        </div>
                         
                         {inquiry.courseId && (
                            <div className="col-span-2">
                                <span className="block text-gray-500 text-xs uppercase font-semibold">Interested Course</span>
                                <span className="font-medium text-gray-900">{inquiry.courseId.name}</span>
                            </div>
                         )}


                        <div className="col-span-2 bg-gray-50 p-2 font-bold text-blue-800 uppercase text-xs tracking-wider border-l-4 border-blue-500 mt-2">
                            Student Details
                        </div>

                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">First Name</span>
                            <span className="font-medium text-gray-900">{inquiry.firstName}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Last Name</span>
                            <span className="font-medium text-gray-900">{inquiry.lastName}</span>
                        </div>
                         <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Gender</span>
                            <span className="font-medium text-gray-900">{inquiry.gender}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">DOB</span>
                            <span className="font-medium text-gray-900">{inquiry.dob ? formatDate(inquiry.dob) : '-'}</span>
                        </div>


                        <div className="col-span-2 bg-gray-50 p-2 font-bold text-blue-800 uppercase text-xs tracking-wider border-l-4 border-blue-500 mt-2">
                            Contact Information
                        </div>

                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Contact (Student)</span>
                            <span className="font-medium text-gray-900">{inquiry.contactStudent || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Contact (Parent)</span>
                            <span className="font-medium text-gray-900">{inquiry.contactParent || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Contact (Home)</span>
                            <span className="font-medium text-gray-900">{inquiry.contactHome || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Email</span>
                            <span className="font-medium text-gray-900">{inquiry.email || '-'}</span>
                        </div>

                         <div className="col-span-2">
                            <span className="block text-gray-500 text-xs uppercase font-semibold">Address</span>
                            <span className="font-medium text-gray-900 block max-w-md">{inquiry.address || '-'}</span>
                        </div>
                        
                        <div className="col-span-2 text-center my-4 border-t border-b py-2 bg-gray-100">
                             <div className="flex justify-around">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase font-semibold">Current Status</span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${inquiry.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {inquiry.status}
                                    </span>
                                </div>
                                {inquiry.allocatedTo && (
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase font-semibold">Allocated To</span>
                                        <span className="font-medium text-blue-700">{inquiry.allocatedTo.name}</span>
                                    </div>
                                )}
                             </div>
                        </div>

                        {inquiry.followUpDate && (
                            <div className="col-span-2 border p-3 rounded border-gray-200">
                                <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Last Follow Up</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-xs text-gray-500">Date:</span> <span className="font-medium">{formatDate(inquiry.followUpDate)}</span>
                                    </div>
                                     <div>
                                        <span className="text-xs text-gray-500">Time:</span> <span className="font-medium">{new Date(inquiry.followUpDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-xs text-gray-500">Remarks:</span> 
                                        <p className="text-gray-800 mt-1 italic">"{inquiry.followUpDetails}"</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    
                    <div className="mt-8 pt-8 border-t text-center text-xs text-gray-400">
                        <p>Compass Education ERP System</p>
                    </div>

                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #print-content, #print-content * {
                                visibility: visible;
                            }
                            #print-content {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                            }
                            /* Tailwind override for modal centering in print */
                            .fixed {
                                position: static !important;
                            }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default InquiryViewModal;
