import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const { setShowLogin, user, credit, logout } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/">
        <img className="w-28 sm:w-32 lg:w-40" src={assets.logo} alt="Logo" />
      </Link>

      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Credits Button */}
            <button
              onClick={() => navigate('/buy')}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700"
            >
              <img className="w-5" src={assets.credit_star} alt="Credits Icon" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Credits left: {credit}
              </p>
            </button>

            {/* Greeting */}
            <p className="text-gray-600 max-sm:hidden pl-4">Hi, {user.name}</p>

            {/* Profile Dropdown */}
            <div className="relative group">
              <img className="w-10 drop-shadow cursor-pointer" src={assets.profile_icon} alt="Profile Icon" />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                  <li
                    onClick={() => navigate('/payment-history')}
                    className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded pr-10"
                  >
                    Payment History
                  </li>
                  <li
                    onClick={logout}
                    className="py-1 px-2 cursor-pointer hover:bg-gray-100 rounded pr-10"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-5">
            {/* Pricing Link */}
            <p onClick={() => navigate('/buy')} className="cursor-pointer">
              Pricing
            </p>

            {/* Login Button */}
            <button
              onClick={() => setShowLogin(true)}
              className="bg-zinc-800 text-white px-7 py-2 sm:px-10 sm:py-2 text-sm rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
