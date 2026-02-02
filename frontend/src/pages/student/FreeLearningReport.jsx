import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizReport } from '../../features/student/studentPortalSlice';
import Loading from '../../components/Loading';
import { TrendingUp, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment';

const FreeLearningReport = () => {
    const dispatch = useDispatch();
    const { quizReports, isLoading } = useSelector((state) => state.studentPortal);
    // Expand latest report by default or handle expansion
    const [expandedReportId, setExpandedReportId] = useState(null);

    useEffect(() => {
        dispatch(fetchQuizReport());
    }, [dispatch]);

    // Set first report expanded when data loads
    useEffect(() => {
        if (quizReports && quizReports.length > 0 && !expandedReportId) {
            setExpandedReportId(quizReports[0]._id);
        }
    }, [quizReports]);

    const toggleExpand = (id) => {
        setExpandedReportId(expandedReportId === id ? null : id);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <TrendingUp className="text-primary" />
                    Learning Progress Report
                </h1>
                <p className="text-gray-500 mt-1">Track your performance in free learning quizzes.</p>
            </div>

            <div className="space-y-4">
                {quizReports && quizReports.length > 0 ? (
                    quizReports.map((report) => (
                        <div key={report._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Report Header */}
                            <div 
                                onClick={() => toggleExpand(report._id)}
                                className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="bg-white p-2 rounded-lg border border-gray-200 text-center min-w-[80px]">
                                        <div className="text-xs text-uppercase text-gray-500 font-semibold mb-1">SCORE</div>
                                        <div className="text-xl font-bold text-primary">{report.totalScore} <span className="text-gray-400 text-sm">/ {report.questions.length}</span></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Quiz Attempt</h3>
                                        <p className="text-sm text-gray-500">{moment(report.date).format('MMMM Do YYYY, h:mm a')}</p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {expandedReportId === report._id ? <ChevronUp /> : <ChevronDown />}
                                </div>
                            </div>

                            {/* Detailed Results Table */}
                            {expandedReportId === report._id && (
                                <div className="border-t border-gray-200">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100/50 text-gray-600 uppercase text-xs font-semibold">
                                                <tr>
                                                    <th className="p-4 w-1/2">Question</th>
                                                    <th className="p-4">Your Answer</th>
                                                    <th className="p-4">Correct Answer</th>
                                                    <th className="p-4 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {report.questions.map((q, idx) => {
                                                    const questionText = q.questionId ? q.questionId.question : 'Question Deleted';
                                                    const options = q.questionId ? q.questionId.options : [];
                                                    const correctAnswerIdx = q.questionId ? q.questionId.correctOption : -1;
                                                    
                                                    const yourAnswerText = options[q.selectedOption] || 'N/A';
                                                    const correctAnswerText = options[correctAnswerIdx] || 'N/A';

                                                    return (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="p-4 font-medium text-gray-800">{questionText}</td>
                                                            <td className={`p-4 ${q.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                                {yourAnswerText}
                                                            </td>
                                                            <td className="p-4 text-gray-600">
                                                                {correctAnswerText}
                                                            </td>
                                                            <td className="p-4 text-center">
                                                                {q.isCorrect ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                                                                        <Check size={12} /> Correct
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold border border-red-100">
                                                                        <X size={12} /> Incorrect
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                        No progress reports found. Start a "Free Learning" quiz to see your progress!
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreeLearningReport;
