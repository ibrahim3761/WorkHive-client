import React from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// Placeholder user state; replace with AuthContext when ready

const Navbar = () => {
  const { user, logOut } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["userData", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // if (isError) {
  //   return (
  //     <div className="text-center text-red-500">Failed to load profile.</div>
  //   );
  // }

  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("User signed out successfully");
        queryClient.clear();
      })
      .catch((error) => {
        console.error("Error signing out:", error.message);
      });
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
              : "text-blue-900 hover:text-yellow-500 pb-1"
          }
        >
          Home
        </NavLink>
      </li>
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

      <li>
        <NavLink
          to="/about-us"
          className={({ isActive }) =>
            isActive
              ? "text-yellow-500 font-semibold border-b-2 border-yellow-500 pb-1"
              : "text-blue-900 hover:text-yellow-500 pb-1"
          }
        >
          About Us
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-white shadow-sm px-4 md:px-8 fixed top-0 z-50">
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
                href="https://github.com/ibrahim3761/WorkHive-client.git"
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
        <Link to="/" className="text-2xl font-bold">
          <span className="text-yellow-500 ">Work</span>
          <span className="text-blue-700">Hive</span>
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
          className="btn bg-blue-900 text-yellow-400 hidden md:block md:inline-flex"
        >
          Join as Developer
        </a>
      </div>
    </div>
  );
};

export default Navbar;
