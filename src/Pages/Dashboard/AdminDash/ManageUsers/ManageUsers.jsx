import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const roles = ["Admin", "Buyer", "Worker"];

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire("Deleted!", "User has been removed.", "success");
    },
  });

  // Update Role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allUsers"]);
      Swal.fire("Success", "Role updated successfully.", "success");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-white rounded-xl shadow">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Coin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>
                  <img
                    src={user.photo}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={user.role}
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        id: user._id,
                        role: e.target.value,
                      })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{user.coins}</td>
                <td>
                  <button
                    className="btn btn-xs bg-red-500 text-white"
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "This action cannot be undone!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteUserMutation.mutate(user._id);
                        }
                      });
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
