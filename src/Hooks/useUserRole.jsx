import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: userInfo = {},
    isPending,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading, // only fetch when email is available
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`); 
      return res.data;
    },
  });

  console.log(userInfo.role);
  

  return {  role: userInfo?.role, isLoading: isPending || isLoading, isError };
};

export default useUserRole;