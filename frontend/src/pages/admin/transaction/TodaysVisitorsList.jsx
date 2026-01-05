import React from 'react';
import { Users, Calendar } from 'lucide-react';

const TodaysVisitorsList = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <Calendar className="text-blue-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Today's Visitors List</h2>
            <p className="text-sm text-gray-500">View all visitors scheduled for today</p>
          </div>
        </div>

        {/* Add your visitors list table here */}
        <p className="text-gray-600">Today's visitors list coming soon...</p>
      </div>
    </div>
  );
};

export default TodaysVisitorsList;
