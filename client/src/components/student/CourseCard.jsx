import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext)

    return (
        <Link 
            onClick={() => scrollTo(0, 0)} 
            to={'/course/' + course._id} 
            className="group bg-white border border-gray-200 hover:border-blue-100 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden flex flex-col"
        >
            <div className="relative overflow-hidden">
                <img 
                    className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300" 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                        {course.courseContent?.reduce((total, chapter) => total + chapter.chapterContent.length, 0) || 0} lessons
                    </p>
                </div>
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.courseTitle}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{course.educator.name}</p>
                    
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm font-medium text-gray-700">{calculateRating(course).toFixed(1)}</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    className="w-4 h-4"
                                    src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                                    alt=""
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">({course.courseRatings.length})</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        {course.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                {currency}{course.coursePrice.toFixed(2)}
                            </span>
                        )}
                        <span className="text-xl font-bold text-gray-800">
                            {currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
                        </span>
                    </div>
                    {course.discount > 0 && (
                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                            {course.discount}% OFF
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard