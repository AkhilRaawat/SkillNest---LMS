import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');
  const { backendUrl, isEducator, setIsEducator, navigate, getToken } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (data.success) {
        toast.success(data.message);
        setIsEducator(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 py-2 border-b border-gray-200 ${
      isCoursesListPage ? "bg-white" : "bg-cyan-100/70"
    }`}>
      <Link to="/" className="flex items-center">
        <img
          src="SkillNest Final Logo.svg"
          alt="SkillNest Logo"
          className="logo-png cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out w-[250px] h-[100px] mix-blend-multiply object-cover"
        />
      </Link>

      <div className="md:flex hidden items-center gap-5 text-gray-600">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button 
                onClick={becomeEducator}
                className="hover:text-blue-600 transition-colors"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <span className="text-gray-300">|</span>
              <Link 
                to="/my-enrollments"
                className="hover:text-blue-600 transition-colors"
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-600">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          <button 
            onClick={becomeEducator}
            className="hover:text-blue-600 transition-colors"
          >
            {isEducator ? "Educator Dashboard" : "Become Educator"}
          </button>
          <span className="text-gray-300">|</span>
          {user && (
            <>
              <Link 
                to="/my-enrollments"
                className="hover:text-blue-600 transition-colors"
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button 
            onClick={() => openSignIn()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src={assets.user_icon} alt="Sign in" className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;