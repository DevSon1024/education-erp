import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../features/student/studentSlice';
import SmartTable from '../../components/ui/SmartTable';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, pagination, isLoading } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents({ pageNumber: 1 }));
  }, [dispatch]);

  const columns = [
    { header: 'Reg No', accessor: 'regNo' },
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Course', render: (row) => <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{row.course?.name || 'N/A'}</span> },
    { header: 'Batch', accessor: 'batch' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student List</h1>
        <Link to="/master/student/new" className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition">
          <Plus size={18} /> Add New Student
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <SmartTable 
          columns={columns} 
          data={students} 
          pagination={pagination}
          onPageChange={(p) => dispatch(fetchStudents({ pageNumber: p }))}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(id) => console.log('Delete', id)}
        />
      )}
    </div>
  );
};

export default StudentList;