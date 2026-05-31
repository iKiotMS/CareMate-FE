"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export default function AdminCleanersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "cleaners"],
    queryFn: async () => {
      const res = await apiClient.get("/admin/cleaners");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post("/admin/cleaners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cleaners"] });
      setFormData({ fullName: "", email: "", phone: "", password: "" });
      setShowCreateForm(false);
    },
  });

  const lockMutation = useMutation({
    mutationFn: (cleanerId: string) =>
      apiClient.patch(`/admin/cleaners/${cleanerId}/lock`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cleaners"] });
    },
  });

  const unlockMutation = useMutation({
    mutationFn: (cleanerId: string) =>
      apiClient.patch(`/admin/cleaners/${cleanerId}/unlock`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "cleaners"] });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cleaner Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {showCreateForm ? "Cancel" : "Create Cleaner"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Cleaner</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      )}

      {isLoading && <div className="text-center py-8">Loading cleaners...</div>}

      {response?.cleaners && response.cleaners.length === 0 && (
        <div className="text-center py-8 text-gray-600">No cleaners found</div>
      )}

      {response?.cleaners && response.cleaners.length > 0 && (
        <div className="grid gap-4">
          {response.cleaners.map((cleaner: any) => (
            <div
              key={cleaner._id}
              className="bg-white border border-gray-300 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-lg">{cleaner.fullName}</h3>
                <p className="text-gray-600 text-sm">{cleaner.email}</p>
                {cleaner.phone && (
                  <p className="text-gray-600 text-sm">{cleaner.phone}</p>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    cleaner.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cleaner.isActive ? "Active" : "Locked"}
                </span>
                <button
                  onClick={() => {
                    if (cleaner.isActive) {
                      lockMutation.mutate(cleaner._id);
                    } else {
                      unlockMutation.mutate(cleaner._id);
                    }
                  }}
                  disabled={lockMutation.isPending || unlockMutation.isPending}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 transition text-sm"
                >
                  {cleaner.isActive ? "Lock" : "Unlock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
