import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CloudinaryVideoPlayer from '../../components/CloudinaryVideoPlayer';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoNotesSummarizer from '../../components/AI/VideoNotesSummarizer';
import VideoQuestionAnswer from '../../components/AI/VideoQuestionAnswer';

const VideoPlayer = () => {
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();
  const { enrolledCourses, backendUrl, getToken } = useContext(AppContext);
  
  const [courseData, setCourseData] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [nextLecture, setNextLecture] = useState(null);
  const [prevLecture, setPrevLecture] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'questions', 'talk'

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      const course = enrolledCourses.find(c => c._id === courseId);
      if (course) {
        setCourseData(course);
        findCurrentAndAdjacentLectures(course);
      }
    }
  }, [enrolledCourses, courseId, lectureId]);

  const findCurrentAndAdjacentLectures = (course) => {
    let currentFound = false;
    let prevLec = null;
    let nextLec = null;
    let currentLec = null;

    for (let chapter of course.courseContent) {
      for (let i = 0; i < chapter.chapterContent.length; i++) {
        const lecture = chapter.chapterContent[i];
        if (currentFound && !nextLec) {
          nextLec = { ...lecture, chapterTitle: chapter.chapterTitle };
          break;
        }
        if (lecture.lectureId === lectureId) {
          currentLec = { ...lecture, chapterTitle: chapter.chapterTitle };
          currentFound = true;
        }
        if (!currentFound) {
          prevLec = { ...lecture, chapterTitle: chapter.chapterTitle };
        }
      }
      if (currentFound && nextLec) break;
    }

    setCurrentLecture(currentLec);
    setNextLecture(nextLec);
    setPrevLecture(prevLec);
  };

  const markLectureAsCompleted = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  const navigateToLecture = (lecture) => {
    if (lecture) {
      navigate(`/watch/${courseId}/${lecture.lectureId}`);
    }
  };

  if (!currentLecture || !courseData) return null;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Course Content */}
      <div className="w-[240px] bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <button 
            onClick={() => navigate(`/player/${courseId}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Course
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Course Content</h3>
            <div className="space-y-3">
              {courseData.courseContent.map((chapter, chapterIndex) => (
                <div key={chapter.chapterId} className="space-y-1">
                  <h4 className="font-medium text-gray-700 text-sm">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </h4>
                  <div className="space-y-1">
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <button
                        key={lecture.lectureId}
                        onClick={() => navigateToLecture(lecture)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 text-xs ${
                          lecture.lectureId === lectureId
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {progressData?.lectureCompleted.includes(lecture.lectureId) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="truncate">
                          {lectureIndex + 1}. {lecture.lectureTitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Video Section */}
        <div className="bg-black">
          <div className="w-full">
            <CloudinaryVideoPlayer videoUrl={currentLecture.lectureUrl} height="450px" />
          </div>
          {/* Video Info */}
          <div className="px-4 py-2">
            <h2 className="text-xs font-medium text-white inline-block mr-2">{currentLecture.lectureTitle}</h2>
            <span className="text-gray-400 text-xs">{currentLecture.chapterTitle}</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-white border-t border-gray-200">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'notes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notes Summarizer
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'questions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ask Questions
            </button>
            <button
              onClick={() => setActiveTab('talk')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'talk'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Talk to Notes
            </button>

            {/* Lecture Navigation */}
            <div className="ml-auto flex items-center px-4">
              <button
                onClick={() => navigateToLecture(prevLecture)}
                disabled={!prevLecture}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg mr-2 ${
                  prevLecture 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <button
                onClick={() => navigateToLecture(nextLecture)}
                disabled={!nextLecture}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                  nextLecture 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'notes' && (
              <VideoNotesSummarizer videoId={currentLecture.lectureId} />
            )}
            {activeTab === 'questions' && (
              <VideoQuestionAnswer videoId={currentLecture.lectureId} />
            )}
            {activeTab === 'talk' && (
              <div className="text-center text-gray-500">
                Talk to Notes feature coming soon...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 