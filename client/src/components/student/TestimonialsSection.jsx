import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className="py-14 px-8 md:px-0 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-medium text-gray-800 mb-3">What Our Students Say</h2>
        <p className="md:text-base text-sm text-gray-500 max-w-2xl mx-auto">
          Hear from our learners as they share their journeys of transformation and success with SkillNest's learning platform.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col h-full text-sm border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50">
              <img 
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" 
                src={testimonial.image} 
                alt={testimonial.name} 
              />
              <div>
                <h3 className="text-base font-semibold text-gray-800">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-4 w-4"
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">{testimonial.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
