import React from 'react';
import { FileText } from 'lucide-react';

const InquiryDSR = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <FileText className="text-purple-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daily Status Report (DSR)</h2>
            <p className="text-sm text-gray-500">Track daily inquiry activities and follow-ups</p>
          </div>
        </div>

        {/* Add your DSR content here */}
        <p className="text-gray-600">DSR tracking coming soon...</p>
      </div>
    </div>
  );
};

export default InquiryDSR;
