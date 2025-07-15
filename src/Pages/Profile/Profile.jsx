import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";
import { FiUser, FiMail, FiAward, FiDollarSign, FiUpload, FiSave } from "react-icons/fi";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const { data: userData = {}, isLoading } = useQuery({
    queryKey: ["userInfo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      setProfilePic(res.data.photo);
      return res.data;
    },
  });

  const { register, handleSubmit } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setProfilePic(res.data.secure_url);
      Swal.fire({
        title: "Success!",
        text: "Profile image uploaded successfully",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({
        title: "Error",
        text: "Image upload failed",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      return await axiosSecure.patch(`/users/update/${user.email}`, updatedData);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Updated!",
        text: "Your profile has been updated",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
      queryClient.invalidateQueries(["userInfo", user.email]);
      queryClient.invalidateQueries(["user", user.email]);
    },
    onError: () => {
      Swal.fire({
        title: "Error",
        text: "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    },
  });

  const onSubmit = (data) => {
    const updated = {
      name: data.name || userData.name,
      photo: profilePic || userData.photo,
    };
    updateMutation.mutate(updated);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h2>
        <p className="text-gray-600">Update your personal information</p>
      </div>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <img
            src={profilePic || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover shadow-md"
          />
          <label className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <FiUpload className="text-white text-2xl mx-auto" />
              <span className="text-white text-xs mt-1 block">Change Photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        {uploading && (
          <p className="mt-2 text-sm text-blue-600 flex items-center justify-center gap-1">
            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiMail className="text-blue-500" /> Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            value={userData.email}
            disabled
          />
        </div>

        {/* Name Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiUser className="text-blue-500" /> Name
          </label>
          <input
            type="text"
            defaultValue={userData.name}
            {...register("name")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Role Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiAward className="text-blue-500" /> Role
          </label>
          <input
            type="text"
            value={userData.role}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Coins Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiDollarSign className="text-yellow-500" /> Coins
          </label>
          <input
            type="text"
            value={userData.coins}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FiSave /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;