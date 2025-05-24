import logo from './logo.svg'
import logo_dark from './logo_dark.svg'
import search_icon from './search_icon.svg'
import cross_icon from './cross_icon.svg'
import upload_area from './upload_area.svg'
import sketch from './sktech.svg'
import microsoft_logo from './microsoft_logo.svg'
import walmart_logo from './walmart_logo.svg'
import accenture_logo from './accenture_logo.svg'
import adobe_logo from './adobe_logo.svg'
import paypal_logo from './paypal_logo.svg'
import course_1_thumbnail from './course_1.png'
import course_2_thumbnail from './course_2.png'
import course_3_thumbnail from './course_3.png'
import course_4_thumbnail from './course_4.png'
import star from './rating_star.svg'
import star_blank from './star_dull_icon.svg'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'
import profile_img_3 from './profile_img_3.png'
import arrow_icon from './arrow_icon.svg'
import down_arrow_icon from './down_arrow_icon.svg'
import time_left_clock_icon from './time_left_clock_icon.svg'
import time_clock_icon from './time_clock_icon.svg'
import user_icon from './user_icon.svg'
import home_icon from './home_icon.svg'
import add_icon from './add_icon.svg'
import my_course_icon from './my_course_icon.svg'
import person_tick_icon from './person_tick_icon.svg'
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import file_upload_icon from './file_upload_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import dropdown_icon from './dropdown_icon.svg'
import patients_icon from './patients_icon.svg'
import play_icon from './play_icon.svg'
import blue_tick_icon from './blue_tick_icon.svg'
import course_4 from './course_4.png'
import profile_img from './profile_img.png'
import profile_img2 from './profile_img2.png'
import profile_img3 from './profile_img3.png'
import lesson_icon from './lesson_icon.svg'


export const assets = {
    logo,
    search_icon,
    sketch,
    microsoft_logo,
    walmart_logo,
    accenture_logo,
    adobe_logo,
    paypal_logo,
    course_1_thumbnail,
    course_2_thumbnail,
    course_3_thumbnail,
    course_4_thumbnail,
    star,
    star_blank,
    profile_img_1,
    profile_img_2,
    profile_img_3,
    arrow_icon,
    dropdown_icon,
    cross_icon,
    upload_area,
    logo_dark,
    down_arrow_icon,
    time_left_clock_icon,
    time_clock_icon,
    user_icon,
    home_icon,
    add_icon,
    my_course_icon,
    person_tick_icon,
    facebook_icon,
    instagram_icon,
    twitter_icon,
    course_4,
    file_upload_icon,
    appointments_icon,
    earning_icon,
    patients_icon,
    profile_img,
    profile_img2,
    profile_img3,
    play_icon,
    blue_tick_icon,
    lesson_icon
}

export const dummyTestimonial = [
    {
        name: 'Donald Jackman',
        role: 'SWE 1 @ Amazon',
        image: assets.profile_img_1,
        rating: 5,
        feedback: 'I\'ve been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.',
    },
    {
        name: 'Richard Nelson',
        role: 'SWE 2 @ Samsung',
        image: assets.profile_img_2,
        rating: 4,
        feedback: 'I\'ve been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.',
    },
    {
        name: 'James Washington',
        role: 'SWE 2 @ Google',
        image: assets.profile_img_3,
        rating: 4.5,
        feedback: 'I\'ve been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.',
    },
];

export const dummyCourses = [
    {
        courseTitle: "Introduction to JavaScript",
        courseDescription: `
            <h2>Learn the Basics of JavaScript</h2>
            <p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p>
            <p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p>
            <ul>
                <li>Understand the basics of programming</li>
                <li>Learn how to manipulate the DOM</li>
                <li>Create dynamic web applications</li>
            </ul>
        `,
        courseThumbnail: "https://example.com/thumbnails/js-course.jpg",
        coursePrice: 49.99,
        isPublished: true,
        discount: 20,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "Getting Started with JavaScript",
                chapterContent: [
                    {
                        lectureId: "lecture1",
                        lectureTitle: "What is JavaScript?",
                        lectureDuration: 600,
                        lectureUrl: "https://example.com/lectures/what-is-js",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture2",
                        lectureTitle: "Setting Up Your Environment",
                        lectureDuration: 900,
                        lectureUrl: "https://example.com/lectures/setup-env",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            },
            {
                chapterId: "chapter2",
                chapterOrder: 2,
                chapterTitle: "Variables and Data Types",
                chapterContent: [
                    {
                        lectureId: "lecture3",
                        lectureTitle: "Understanding Variables",
                        lectureDuration: 750,
                        lectureUrl: "https://example.com/lectures/variables",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture4",
                        lectureTitle: "Data Types in JavaScript",
                        lectureDuration: 800,
                        lectureUrl: "https://example.com/lectures/data-types",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ],
        educator: "605c72efb3f1c2b1f8e4e1a1", 
        courseRatings: [
            {
                userId: "user1",
                rating: 5
            },
            {
                userId: "user2",
                rating: 4
            }
        ],
        enrolledStudents: [
        
        ]
    },
    {
        courseTitle: "Advanced Python Programming",
        courseDescription: `
            <h2>Deep Dive into Python Programming</h2>
            <p>This course is designed for those who have a basic understanding of Python and want to take their skills to the next level. You will explore advanced topics such as decorators, generators, and context managers.</p>
            <p>By the end of this course, you will be able to write efficient and clean Python code, and understand how to leverage Python's powerful features for real-world applications.</p>
            <ul>
                <li>Master advanced data structures</li>
                <li>Implement object-oriented programming concepts</li>
                <li>Work with libraries and frameworks</li>
            </ul>
        `,
        courseThumbnail: "https://example.com/thumbnails/python-course.jpg",
        coursePrice: 79.99,
        isPublished: true,
        discount: 15,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "Advanced Data Structures",
                chapterContent: [
                    {
                        lectureId: "lecture1",
                        lectureTitle: "Lists and Tuples",
                        lectureDuration: 720,
                        lectureUrl: "https://example.com/lectures/lists-tuples",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture2",
                        lectureTitle: "Dictionaries and Sets",
                        lectureDuration: 850,
                        lectureUrl: "https://example .com/lectures/dicts-sets",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            },
            {
                chapterId: "chapter2",
                chapterOrder: 2,
                chapterTitle: "Object-Oriented Programming",
                chapterContent: [
                    {
                        lectureId: "lecture3",
                        lectureTitle: "Classes and Objects",
                        lectureDuration: 900,
                        lectureUrl: "https://example.com/lectures/classes-objects",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture4",
                        lectureTitle: "Inheritance and Polymorphism",
                        lectureDuration: 950,
                        lectureUrl: "https://example.com/lectures/inheritance-polymorphism",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ],
        educator: "605c72efb3f1c2b1f8e4e1a4", 
        courseRatings: [
            {
                userId: "user3",
                rating: 5
            },
            {
                userId: "user4",
                rating: 3
            }
        ],
        enrolledStudents: [
           
        ]
    },
    {
        courseTitle: "Web Development Bootcamp",
        courseDescription: `
            <h2>Become a Full-Stack Web Developer</h2>
            <p>This comprehensive bootcamp covers everything you need to know to become a full-stack web developer. From HTML and CSS to JavaScript and backend technologies, this course is designed to take you from beginner to job-ready.</p>
            <p>Throughout the course, you will work on real-world projects, build a portfolio, and gain the skills necessary to succeed in the tech industry.</p>
            <ul>
                <li>Learn front-end and back-end development</li>
                <li>Build responsive and dynamic web applications</li>
                <li>Understand databases and server-side programming</li>
            </ul>
        `,
        courseThumbnail: "https://example.com/thumbnails/web-dev-bootcamp.jpg",
        coursePrice: 99.99,
        isPublished: true,
        discount: 25,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "HTML & CSS Basics",
                chapterContent: [
                    {
                        lectureId: "lecture1",
                        lectureTitle: "Introduction to HTML",
                        lectureDuration: 600,
                        lectureUrl: "https://example.com/lectures/html-intro",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture2",
                        lectureTitle: "Styling with CSS",
                        lectureDuration: 720,
                        lectureUrl: "https://example.com/lectures/css-styling",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            },
            {
                chapterId: "chapter2",
                chapterOrder: 2,
                chapterTitle: "JavaScript Fundamentals",
                chapterContent: [
                    {
                        lectureId: "lecture3",
                        lectureTitle: "JavaScript Basics",
                        lectureDuration: 800,
                        lectureUrl: "https://example.com/lectures/js-basics",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture4",
                        lectureTitle: "DOM Manipulation",
                        lectureDuration: 850,
                        lectureUrl: "https://example.com/lectures/dom-manipulation",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ],
        educator: "605c72efb3f1c2b1f8e4e1a7", 
        courseRatings: [
            {
                userId: "user5",
                rating: 4
            },
            {
                userId: "user6",
                rating: 5
            }
        ],
        enrolledStudents: [
           
        ]
    },
    {
        courseTitle: "Data Science and Machine Learning",
        courseDescription: `
            <h2>Unlock the Power of Data</h2>
            <p>This course provides a comprehensive introduction to data science and machine learning. You will learn how to analyze data, build predictive models, and apply machine learning algorithms to real-world problems.</p>
            <p>By the end of this course, you will have a solid understanding of data manipulation, visualization, and machine learning techniques, enabling you to make data-driven decisions.</p>
            <ul>
                <li>Understand data analysis and visualization</li>
                <li>Learn machine learning algorithms and their applications</li>
                <li>Work with popular data science libraries like Pandas and Scikit-Learn</li>
            </ul>
        `,
        courseThumbnail: "https://example.com/thumbnails/data-science.jpg",
        coursePrice: 89.99,
        isPublished: true,
        discount: 30,
        courseContent: [
            {
                chapterId: "chapter1",
                chapterOrder: 1,
                chapterTitle: "Introduction to Data Science",
                chapterContent: [
                    {
                        lectureId: "lecture1",
                        lectureTitle: "What is Data Science?",
                        lectureDuration: 600,
                        lectureUrl: "https://example.com/lectures/what-is-data-science",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture2",
                        lectureTitle: "Data Collection and Cleaning",
                        lectureDuration: 720,
                        lectureUrl: "https://example.com/lectures/data-collection",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            },
            {
                chapterId: "chapter2",
                chapterOrder: 2,
                chapterTitle: "Machine Learning Basics",
                chapterContent: [
                    {
                        lectureId: "lecture3",
                        lectureTitle: "Supervised vs Unsupervised Learning",
                        lectureDuration: 800,
                        lectureUrl: "https://example.com/lectures/supervised-unsupervised",
                        isPreviewFree: true,
                        lectureOrder: 1
                    },
                    {
                        lectureId: "lecture4",
                        lectureTitle: "Building Your First Model",
                        lectureDuration: 850,
                        lectureUrl: "https://example.com/lectures/building-model",
                        isPreviewFree: false,
                        lectureOrder: 2
                    }
                ]
            }
        ],
        educator: "605c72efb3f1c2b1f8e4e1aa", 
        courseRatings: [
            {
                userId: "user7",
                rating: 5
            },
            {
                userId: "user8",
                rating: 4
            }
        ],
        enrolledStudents: [

        ]
    }
];