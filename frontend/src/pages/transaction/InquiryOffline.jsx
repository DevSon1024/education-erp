import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';

const InquiryOffline = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <UserCheck className="text-green-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Offline Inquiry</h2>
            <p className="text-sm text-gray-500">Manage walk-in inquiries at the office</p>
          </div>
        </div>

        {/* Add your offline inquiry form here */}
        <p className="text-gray-600">Offline inquiry form coming soon...</p>
      </div>
    </div>
  );
};

export default InquiryOffline;
