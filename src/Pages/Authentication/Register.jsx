import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const [profilePic, setProfilePic] = useState("");

  const onSubmit = async (data) => {
    try {
      const role = data.role;
      const defaultCoins = role === "Buyer" ? 50 : 10;

      // Create user
      const result = await createUser(data.email, data.password);

      // Prepare user info
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: profilePic,
        role: role,
        coins: defaultCoins,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      // Save to DB
      const res = await axiosInstance.post("/users", userInfo);
      if (res.data.insertedId) {
        // Update Firebase profile
        await updateUserProfile({
          displayName: data.name,
          photoURL: profilePic,
        });

        Swal.fire("Success!", "Account created successfully", "success");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Swal.fire("Error", "Email is already registered", "error");
      } else {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    setProfilePic(res.data.secure_url);
  };

  

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
      <p className="text-center text-gray-500 mb-6">Register to WorkHive</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input input-bordered w-full"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-red-500">Name is required</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+\.\S+$/,
            })}
            className="input input-bordered w-full"
            placeholder="Your Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500">Email is required</p>
          )}
          {errors.email?.type === "pattern" && (
            <p className="text-red-500">Enter a valid email address</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z])/,
            })}
            className="input input-bordered w-full"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500">
              Password must be at least 6 characters
            </p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-500">
              Password must contain at least one uppercase letter
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="label">Register As</label>
          <select
            {...register("role", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select role</option>
            <option value="Worker">Worker (10 Coins)</option>
            <option value="Buyer">Buyer (50 Coins)</option>
          </select>
          {errors.role && (
            <p className="text-red-500">Please select a role</p>
          )}
        </div>

        <button type="submit" className="btn bg-yellow-400 text-blue-900 w-full">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
