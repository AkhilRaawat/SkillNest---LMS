import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyEnrollments = () => {
    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)
    const [progressArray, setProgressData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getCourseProgress = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    let totalLectures = calculateNoOfLectures(course);
                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    return { totalLectures, lectureCompleted };
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            toast.error(error.message);
            setProgressData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserEnrolledCourses();
        }
    }, [userData]);

    useEffect(() => {
        if (enrolledCourses.length > 0) {
            getCourseProgress();
        } else {
            setIsLoading(false);
        }
    }, [enrolledCourses]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className='max-w-7xl mx-auto md:px-8 px-4 py-12'>
                <div className="flex items-center justify-between mb-8">
                    <h1 className='text-2xl font-semibold text-gray-800'>My Enrollments</h1>
                    {enrolledCourses.length === 0 && (
                        <button 
                            onClick={() => navigate('/course-list')}
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Browse Courses
                        </button>
                    )}
                </div>

                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            No enrolled courses yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Start your learning journey by enrolling in a course
                        </p>
                        <button 
                            onClick={() => navigate('/course-list')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Explore Courses
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-900 border-b border-gray-200 text-sm text-left max-sm:hidden">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Course</th>
                                    <th className="px-6 py-4 font-semibold max-sm:hidden">Duration</th>
                                    <th className="px-6 py-4 font-semibold max-sm:hidden">Completed</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {enrolledCourses.map((course, index) => (
                                    <tr key={course._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <img 
                                                    src={course.courseThumbnail} 
                                                    alt={course.courseTitle}
                                                    className="w-20 h-14 object-cover rounded"
                                                />
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-sm font-medium text-gray-900 truncate mb-1'>
                                                        {course.courseTitle}
                                                    </p>
                                                    <Line 
                                                        className='bg-gray-200 rounded-full' 
                                                        strokeWidth={2}
                                                        strokeColor="#2563eb"
                                                        percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0} 
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-sm:hidden">
                                            {calculateCourseDuration(course)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-sm:hidden">
                                            {progressArray[index] && (
                                                <span>
                                                    {progressArray[index].lectureCompleted} / {progressArray[index].totalLectures}
                                                    <span className='text-xs ml-2 text-gray-500'>Lectures</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => navigate('/player/' + course._id)} 
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                    progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                            >
                                                {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 
                                                    ? 'Completed' 
                                                    : 'Continue Learning'
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyEnrollments;