import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div className="py-20 md:px-40 px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Learn from the best
          </h2>
          <p className="md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link 
            to={'/course-list'} 
            onClick={() => scrollTo(0, 0)} 
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-300"
          >
            Show all courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
