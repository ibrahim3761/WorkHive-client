import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth.JSX";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:3000`,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Setup interceptors when user changes
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error.response?.status;
        console.log("inside res interceptor", status);

        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 401) {
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch(() => {
              console.error("Logout failed");
            });
        }

        return Promise.reject(error);
      }
    );

    // ✅ Clean up to prevent stacking interceptors
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
