import React from 'react';
import { CheckCircle } from 'lucide-react';

const TodaysVisitedReport = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <CheckCircle className="text-green-500" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Today's Visited Report</h2>
            <p className="text-sm text-gray-500">Report of visitors who attended today</p>
          </div>
        </div>

        {/* Add your visited report content here */}
        <p className="text-gray-600">Today's visited report coming soon...</p>
      </div>
    </div>
  );
};

export default TodaysVisitedReport;
