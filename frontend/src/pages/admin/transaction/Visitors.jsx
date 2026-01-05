import React from 'react';
import { Users } from 'lucide-react';

const Visitors = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Users className="text-indigo-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Visitors</h2>
            <p className="text-sm text-gray-500">Manage all visitor records</p>
          </div>
        </div>

        {/* Add your visitors management content here */}
        <p className="text-gray-600">Visitors management coming soon...</p>
      </div>
    </div>
  );
};

export default Visitors;
