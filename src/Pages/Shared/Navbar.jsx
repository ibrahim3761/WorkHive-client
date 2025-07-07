import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

// Placeholder user state; replace with AuthContext when ready

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxios();

  const {
    data: userData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Failed to load profile.</div>
    );
  }
  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  const navLinks = (
    <>
      {user && (
        <>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
                  : "text-blue-900 hover:text-yellow-500 pb-1"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <span className="text-blue-900 hover:text-yellow-500 pb-1 font-semibold flex items-center">
              Coins:
              <span className="ml-1 text-yellow-500">
                {userData?.coins || "--"}
              </span>
            </span>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
                  : "text-blue-900 hover:text-yellow-500 pb-1"
              }
            >
              Profile
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-white shadow-sm px-4 md:px-8">
      {/* Left: Logo and Mobile Hamburger */}
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown lg:hidden -ml-6">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-white rounded-box w-52"
          >
            {navLinks}
            <div className="divider my-2" />
            {!user ? (
              <>
                <li>
                  <Link
                    to="/login"
                    className="btn bg-yellow-400 text-blue-900 w-full"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="btn bg-yellow-400 text-blue-900 w-full"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogOut}
                  className="btn bg-yellow-400 text-blue-900 w-full"
                >
                  Logout
                </button>
              </li>
            )}
            <li>
              <a
                href="https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-ibrahim3761"
                target="_blank"
                rel="noreferrer"
                className="btn bg-blue-900 text-yellow-400 w-full mt-1"
              >
                Join as Developer
              </a>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-900 hover:text-yellow-500 transition"
        >
          WorkHive
        </Link>
      </div>

      {/* Center: Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-6">{navLinks}</ul>
      </div>

      {/* Right: Auth Buttons */}
      <div className="navbar-end space-x-2">
        {!user ? (
          <>
            <Link
              to="/login"
              className="btn bg-yellow-400 text-blue-900 hidden sm:inline-flex"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn bg-yellow-400 text-blue-900 hidden sm:inline-flex"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogOut}
            className="btn bg-yellow-400 text-blue-900 hidden sm:inline-flex"
          >
            Logout
          </button>
        )}
        <a
          href="https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-ibrahim3761"
          target="_blank"
          rel="noreferrer"
          className="btn bg-blue-900 text-yellow-400"
        >
          Join as Developer
        </a>
      </div>
    </div>
  );
};

export default Navbar;
