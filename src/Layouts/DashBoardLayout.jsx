import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Footer from "../Pages/Shared/Footer";

const DashBoardLayout = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const notifRef = useRef();

  const { data: userInfo = {}, isLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const role = userInfo.role;
  const coins = userInfo.coins;

  // 🔹 helper for active/inactive sidebar links
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold border-b-2 border-blue-500 pb-1"
      : "text-blue-900 hover:text-blue-500 pb-1";
      
  useEffect(() => {
    let intervalId;
    if (user?.email) {
      const fetchNotifications = async () => {
        try {
          const res = await axiosSecure.get(
            `/notifications?email=${user.email}`
          );
          const newData = res.data.slice(0, 4); // latest 4 only

          if (
            notifications.length !== newData.length ||
            newData[0]?._id !== notifications[0]?._id
          ) {
            setNotifications(newData);
            setHasNewNotification(true);
          }
        } catch (err) {
          console.error("Notification fetch error:", err);
        }
      };

      fetchNotifications();
      intervalId = setInterval(fetchNotifications, 5000);
    }
    return () => clearInterval(intervalId);
  }, [user?.email, axiosSecure, notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* TOP BAR */}
        <div className="w-full bg-white shadow px-4 py-3 flex justify-between items-center">
          {/* Left side: Homepage + Drawer toggle */}
          <div className="flex items-center gap-3">
            {/* Drawer toggle (mobile only) */}
            <div className="lg:hidden">
              <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
          </div>
          {/* Home button */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>

          {/* Right side: user info + notifications */}
          <div className="flex items-center gap-4 ml-auto relative">
            {!isLoading && (
              <>
                <div className="text-sm text-right hidden md:block">
                  <p className="font-bold text-blue-800">{userInfo.name}</p>
                  <p className="text-gray-500 capitalize">{role}</p>
                  <p className="text-yellow-500 font-medium">{coins} Coins</p>
                </div>
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full ring ring-yellow-300 ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        userInfo.photo || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                    />
                  </div>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) {
                        setHasNewNotification(false);
                      }
                    }}
                  >
                    <Bell size={20} />
                    {hasNewNotification && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div
                      ref={notifRef}
                      className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white border shadow-lg rounded-lg z-50 p-4 space-y-2"
                    >
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-500">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((note, idx) => (
                          <div
                            key={idx}
                            className="block p-2 rounded hover:bg-blue-50 cursor-default"
                          >
                            <p className="text-sm text-gray-800">
                              {note.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(note.time).toLocaleString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-grow px-4 py-6 bg-gray-50">
          <Outlet />
        </div>

        <Footer />
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
          <div className="mb-6 text-2xl font-bold px-2">
            <Link to="/" className="hover:opacity-90 transition">
              <span className="text-yellow-400">Work</span>
              <span className="text-blue-700">Hive</span>
            </Link>
          </div>
          <li>
            <NavLink to="/dashboard" end className={navLinkClass}>
              📊 Overview
            </NavLink>
          </li>
          {!isLoading && role === "Worker" && (
            <>
              <li>
                <NavLink to="/dashboard/tasklist" className={navLinkClass}>
                  📋 Task List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/my-submissions"
                  className={navLinkClass}
                >
                  ✅ My Submissions
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/withdrawals" className={navLinkClass}>
                  💳 Withdrawals
                </NavLink>
              </li>
            </>
          )}
          {!isLoading && role === "Buyer" && (
            <>
              <li>
                <NavLink to="/dashboard/add-task" className={navLinkClass}>
                  📝 Add New Task
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-tasks" className={navLinkClass}>
                  📂 My Tasks
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/purchase-coin" className={navLinkClass}>
                  💰 Purchase Coin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/payment-history"
                  className={navLinkClass}
                >
                  📑 Payment History
                </NavLink>
              </li>
            </>
          )}
          {!isLoading && role === "Admin" && (
            <>
              <li>
                <NavLink to="/dashboard/manage-users" className={navLinkClass}>
                  👥 Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-tasks" className={navLinkClass}>
                  🛠️ Manage Tasks
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="/dashboard/profile" className={navLinkClass}>
              👤 Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashBoardLayout;
