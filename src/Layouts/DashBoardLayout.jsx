import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Footer from "../Pages/Shared/Footer";
import { Bell } from "lucide-react";
import useAuth from "../Hooks/useAuth";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const DashBoardLayout = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

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

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="w-full bg-white shadow px-4 py-3 flex justify-between items-center">
          {/* Sidebar toggle button on small screens */}
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

          {/* User Info & Notification */}
          <div className="flex items-center gap-4 ml-auto">
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
                <button className="btn btn-ghost btn-circle">
                  <Bell size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-grow px-4 py-6 bg-gray-50">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Sidebar */}
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
            <NavLink to="/dashboard" end>
              🏠 Home
            </NavLink>
          </li>

          {/* Worker Routes */}
          {!isLoading && role === "Worker" && (
            <>
              <li>
                <NavLink to="/dashboard/tasklist">📋 Task List</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-submissions">
                  ✅ My Submissions
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/withdrawals">💳 Withdrawals</NavLink>
              </li>
            </>
          )}

          {/* Buyer Routes */}
          {!isLoading && role === "Buyer" && (
            <>
              <li>
                <NavLink to="/dashboard/add-task">📝 Add New Task</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-tasks">📂 My Tasks</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/purchase-coin">
                  💰 Purchase Coin
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/payment-history">
                  📑 Payment History
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Routes */}
          {!isLoading && role === "Admin" && (
            <>
              <li>
                <NavLink to="/dashboard/manage-users">👥 Manage Users</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-tasks">🛠️ Manage Tasks</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashBoardLayout;
