"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useTaskCatalog,
  useCreateOrder,
  useUploadPhotos,
} from "@/hooks/useApi";

export default function CreateOrderPage() {
  const router = useRouter();
  const { data: tasks } = useTaskCatalog(true);
  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: uploadPhotos } = useUploadPhotos();

  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    address: "",
    note: "",
    taskIds: [] as string[],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskToggle = (taskId: string) => {
    setFormData((prev) => ({
      ...prev,
      taskIds: prev.taskIds.includes(taskId)
        ? prev.taskIds.filter((id) => id !== taskId)
        : [...prev.taskIds, taskId],
    }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadPhotos = async () => {
    if (selectedFiles.length === 0) return;
    try {
      const result: any = await uploadPhotos(selectedFiles);
      setPhotoUrls((prev) => [...prev, ...result.urls]);
      setSelectedFiles([]);
    } catch (err) {
      setError("Failed to upload photos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.taskIds.length === 0) {
      setError("Please select at least one task");
      return;
    }

    try {
      await createOrder({
        ...formData,
        photosBeforeBooking: photoUrls,
      });
      router.push("/customer/orders");
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Scheduled Date *
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Time Slot *
            </label>
            <select
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a time slot</option>
              <option value="08:00 - 10:00">08:00 - 10:00</option>
              <option value="10:00 - 12:00">10:00 - 12:00</option>
              <option value="12:00 - 14:00">12:00 - 14:00</option>
              <option value="14:00 - 16:00">14:00 - 16:00</option>
              <option value="16:00 - 18:00">16:00 - 18:00</option>
              <option value="18:00 - 20:00">18:00 - 20:00</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Address *</label>
          <input
            type="text"
            name="address"
            placeholder="Enter full address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Special Instructions
          </label>
          <textarea
            name="note"
            placeholder="Any special requests or notes..."
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tasks */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Select Tasks *
          </label>
          <div className="space-y-2">
            {tasks && tasks.length > 0 ? (
              tasks.map((task: any) => (
                <label key={task._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.taskIds.includes(task._id)}
                    onChange={() => handleTaskToggle(task._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">{task.name}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500">Loading tasks...</p>
            )}
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Current State Photos
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoSelect}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:bg-blue-600 file:text-white file:rounded-lg file:cursor-pointer"
          />

          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleUploadPhotos}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Upload {selectedFiles.length} Photo(s)
              </button>
            </div>
          )}

          {photoUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {photoUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="uploaded"
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isCreating ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}
