import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {
    const { input } = useParams()
    const { allCourses, navigate } = useContext(AppContext)
    const [filteredCourse, setFilteredCourse] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')

    const categories = ['All', 'Development', 'Business', 'Design', 'Marketing', 'IT & Software']

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()
            
            let filtered = tempCourses
            if (input) {
                filtered = tempCourses.filter(
                    item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                )
            }
            if (selectedCategory !== 'All') {
                filtered = filtered.filter(course => course.category === selectedCategory)
            }
            setFilteredCourse(filtered)
        }
    }, [allCourses, input, selectedCategory])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
                            Explore Our Courses
                        </h1>
                        <p className="text-base text-blue-50/90">
                            Discover the perfect course to advance your skills and career
                        </p>
                    </div>
                    <div className="max-w-2xl mx-auto">
                        <SearchBar data={input} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <button 
                                onClick={() => navigate('/')} 
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Home
                            </button>
                        </li>
                        <li className="text-gray-500">/</li>
                        <li className="text-gray-600">Courses</li>
                        {input && (
                            <>
                                <li className="text-gray-500">/</li>
                                <li className="text-gray-600">Search: {input}</li>
                            </>
                        )}
                    </ol>
                </nav>

                {/* Category Filter */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={
                                    selectedCategory === category
                                        ? "px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white transition-colors"
                                        : "px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
                                }
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Results Info */}
                {input && (
                    <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                                {filteredCourse.length} results for "{input}"
                            </span>
                        </div>
                        <button 
                            onClick={() => navigate('/course-list')}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <img src={assets.cross_icon} alt="Clear search" className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Course Grid */}
                {filteredCourse.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourse.map((course, index) => (
                            <CourseCard key={index} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            No courses found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filter to find what you're looking for
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default CoursesList 