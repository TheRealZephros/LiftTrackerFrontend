import React from 'react'
import logo from "./logo.png"
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';

interface NavbarProps {

}

const Navbar = () => {
  const {isLoggedIn, user, logout} = useAuth();
  return (
     <nav className="relative container mx-auto p-6 bg-bg2 shadow-md rounded mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
            <Link to="/">
                <img src={logo} alt="" height="40" width="40" />
            </Link>
          <div className="hidden font-bold lg:flex">
            {/* <Link to="/search" className="text-text1 hover:text-text2">
              Search
            </Link> */}
          </div>
        </div>
        {isLoggedIn() ? (
          <div className="hidden lg:flex items-center space-x-6 text-back">
          <div className="hover:text-text2">Welcome {user?.userName}</div>
          <a
            onClick={logout}
            className="px-8 py-3 font-bold rounded text-text1 bg-button1 hover:bg-button2 cursor-pointer"
          >
            Logout
          </a>
        </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-6 text-back">
          <Link to="/login" className="px-8 py-3 font-bold rounded text-text1 bg-button1 hover:bg-button2 cursor-pointer">Login</Link>
          <Link
            to="/register"
            className="px-8 py-3 font-bold rounded text-text1 bg-button1 hover:bg-button2 cursor-pointer"
          >
            Signup
          </Link>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar
