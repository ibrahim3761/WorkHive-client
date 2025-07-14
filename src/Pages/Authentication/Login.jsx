import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then(async (result) => {
        console.log("User logged in successfully:", result.user);
         Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
        const userInfo = {
          email: data.email,
        };

        navigate("/dashboard");
        await axiosInstance.post("/users", userInfo);
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
        console.error("Login failed full error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        if (error.code === "auth/invalid-credential") {
          Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email & password.",
            toast: true,
            position: "top-start",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } 
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(async (result) => {
        console.log("User logged in with Google:", result.user);

        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          role: "Worker", // default role for Google login
          coins: 10,
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        navigate("/dashboard");
        await axiosInstance.post("/users", userInfo);
      })
      .catch((error) => {
        console.error("Google login failed:", error.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Something went wrong. Please try again.",
          toast: true,
          position: "top-start",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-lg">
      <title>Work Hive || Login</title>
      <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-gray-500 mb-6">Login to WorkHive</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
            placeholder="Your Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z]).*$/,
                message: "Password must contain at least one uppercase letter",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Your Password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-2">
          <button
            type="button"
            className="text-sm text-blue-900 hover:text-yellow-500"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="btn bg-yellow-400 text-blue-900 w-full"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-500 font-medium">
            Register
          </Link>
        </p>

        <div className="divider">OR</div>

        {/* Google Login */}
       <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center border py-2 rounded-lg hover:bg-amber-100 gap-2 cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
