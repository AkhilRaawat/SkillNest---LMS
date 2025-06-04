import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <div className="flex flex-col items-center md:items-start w-full">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-8">
              Skill<span className="text-blue-500">Nest</span>
            </h1>
            <div className="h-px w-full bg-white/20 mb-6"></div>
          </div>
          <p className="text-center md:text-left text-sm text-white/80 leading-relaxed max-w-xl">
            SkillNest is committed to transforming education through accessible, high-quality online learning. Our mission is to empower learners worldwide with industry-relevant skills and knowledge, guided by expert instructors and supported by cutting-edge technology.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input 
              className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm focus:border-blue-500 transition-colors" 
              type="email" 
              placeholder="Enter your email" 
            />
            <button className="bg-blue-600 w-24 h-9 text-white rounded hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2024 © SkillNest. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
