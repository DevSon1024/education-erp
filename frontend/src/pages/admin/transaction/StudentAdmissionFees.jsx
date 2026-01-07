import React from 'react';
import { DollarSign } from 'lucide-react';

const StudentAdmissionFees = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <DollarSign className="text-green-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pending Admission Fees</h2>
            <p className="text-sm text-gray-500">Manage admission fee collection</p>
          </div>
        </div>

        {/* Add your admission fees content here */}
        <p className="text-gray-600">Admission fees management coming soon...</p>
      </div>
    </div>
  );
};

export default StudentAdmissionFees;
