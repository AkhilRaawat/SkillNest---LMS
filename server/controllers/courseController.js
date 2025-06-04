import Course from "../models/Course.js"


// Get All Courses
export const getAllCourse = async (req, res) => {
    try {

        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: '-password' })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Get Course by Id
export const getCourseId = async (req, res) => {

    const { id } = req.params

    try {

        const courseData = await Course.findById(id)
            .populate({ path: 'educator'})

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, courseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Delete Course by Id
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Check if the course has any enrolled students
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            return res.json({ 
                success: false, 
                message: 'Cannot delete course with enrolled students' 
            });
        }

        await Course.findByIdAndDelete(id);
        
        res.json({ 
            success: true, 
            message: 'Course deleted successfully' 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
} 