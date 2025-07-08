import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import Swal from "sweetalert2";

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
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full"
        >
          <svg
            aria-label="Google logo"
            width="20"
            height="20"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              fill="#4285f4"
              d="M432 256c0-17-2-34-6-50H256v94h99c-4 23-17 43-36 57v47h58c34-31 55-77 55-148z"
            />
            <path
              fill="#34a853"
              d="M256 512c69 0 127-23 169-63l-58-47c-27 18-61 28-111 28-85 0-156-57-182-134H15v52c42 83 129 139 241 139z"
            />
            <path
              fill="#fbbc04"
              d="M74 314c-10-29-10-60 0-88V174H15c-18 36-29 77-29 122s11 86 29 122l59-47z"
            />
            <path
              fill="#ea4335"
              d="M256 100c37 0 70 13 96 38l72-72C381 24 324 0 256 0 144 0 57 56 15 139l59 47c26-77 97-134 182-134z"
            />
          </svg>
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
