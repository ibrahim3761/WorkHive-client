import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const { data: userData = {}, isLoading, isError } = useQuery({
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
    return <div className="text-center text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md text-center">
      <div className="flex flex-col items-center">
        <img
          src={userData?.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover"
        />
        <h2 className="text-2xl font-bold text-blue-900 mt-4">
          {userData?.name}
        </h2>
        <p className="text-gray-600">{userData?.email}</p>
      </div>

      <div className="mt-6 space-y-2 text-left text-sm text-gray-700">
        <p>
          <span className="font-semibold text-blue-700">Role:</span>{" "}
          {userData?.role}
        </p>
        <p>
          <span className="font-semibold text-blue-700">Coins:</span>{" "}
          {userData?.coins}
        </p>
        <p>
          <span className="font-semibold text-blue-700">Joined:</span>{" "}
          {new Date(userData?.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
