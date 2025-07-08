import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const AddTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_upload_key
      }`,
      formData
    );

    setImageUrl(res.data.data.url);
  };

  const onSubmit = async (data) => {
    const totalPay = data.required_workers * data.payable_amount;

    // Get user info to check coin balance
    const userRes = await axiosSecure.get(`/users/${user.email}`);
    const userInfo = userRes.data;

    if (userInfo.coins < totalPay) {
      Swal.fire({
        icon: "warning",
        title: "Not Enough Coins",
        text: "Purchase more coins to add this task!",
      });
      return navigate("/dashboard/purchase-coin");
    }

    const task = {
      task_title: data.task_title,
      task_detail: data.task_detail,
      required_workers: parseInt(data.required_workers),
      payable_amount: parseFloat(data.payable_amount),
      total_payment: totalPay,
      completion_date: data.completion_date,
      submission_info: data.submission_info,
      task_image_url: imageUrl,
      created_by: user.email,
      status: "open",
      created_at: new Date(),
    };

    // Save task to DB
    const res = await axiosSecure.post("/tasks", task);

    if (res.data.insertedId) {
      await axiosSecure.patch("/users/deduct-coins", {
        email: user.email,
        amount: totalPay,
        coins: totalPay,
        taskId: res.data.insertedId,
      });

      await queryClient.invalidateQueries({ queryKey: ["userInfo", user.email] });

      Swal.fire({
        icon: "success",
        title: "Task Created!",
        text: "Your task has been successfully posted.",
      });

      reset();
      setImageUrl("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Add New Task</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-xl shadow-lg"
      >
        <div>
          <label className="label">Task Title</label>
          <input
            type="text"
            {...register("task_title", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Task Details</label>
          <textarea
            {...register("task_detail", { required: true })}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Required Workers</label>
            <input
              type="number"
              {...register("required_workers", { required: true })}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Payable Amount (Per Worker)</label>
            <input
              type="number"
              step="0.01"
              {...register("payable_amount", { required: true })}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div>
          <label className="label">Deadline</label>
          <input
            type="date"
            {...register("completion_date", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Submission Info</label>
          <input
            type="text"
            {...register("submission_info", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Task Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-32 h-20 mt-2 rounded shadow"
            />
          )}
        </div>

        <button type="submit" className="btn bg-blue-600 text-white w-full">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
