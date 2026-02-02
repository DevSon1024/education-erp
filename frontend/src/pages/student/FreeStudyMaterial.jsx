import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudyMaterials } from '../../features/student/studentPortalSlice';
import Loading from '../../components/Loading';
import { FileText, Download, ExternalLink } from 'lucide-react';

const FreeStudyMaterial = () => {
    const dispatch = useDispatch();
    const { studyMaterials, isLoading } = useSelector((state) => state.studentPortal);

    useEffect(() => {
        dispatch(fetchStudyMaterials());
    }, [dispatch]);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <FileText className="text-primary" />
                    Free Study Material
                </h1>
                <p className="text-gray-500 mt-1">Access study resources provided by the institute.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-blue-600 text-white uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">More Details</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {studyMaterials && studyMaterials.length > 0 ? (
                                studyMaterials.map((material, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">
                                            {material.title}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {material.description || '-'}
                                        </td>
                                        <td className="p-4 text-center">
                                            <a 
                                                href={material.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
                                            >
                                                <Download size={14} />
                                                Download / View
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500 py-8">
                                        No study materials available at the moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FreeStudyMaterial;
