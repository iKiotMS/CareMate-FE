"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export default function AdminCustomersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "customers", { search: searchTerm }],
    queryFn: async () => {
      const res = await apiClient.get("/admin/customers", {
        params: { search: searchTerm },
      });
      return res.data;
    },
  });

  const lockMutation = useMutation({
    mutationFn: (customerId: string) =>
      apiClient.patch(`/admin/customers/${customerId}/lock`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });

  const unlockMutation = useMutation({
    mutationFn: (customerId: string) =>
      apiClient.patch(`/admin/customers/${customerId}/unlock`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Customer Management</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8">Loading customers...</div>
      )}

      {response?.customers && response.customers.length === 0 && (
        <div className="text-center py-8 text-gray-600">No customers found</div>
      )}

      {response?.customers && response.customers.length > 0 && (
        <div className="grid gap-4">
          {response.customers.map((customer: any) => (
            <div
              key={customer._id}
              className="bg-white border border-gray-300 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-lg">{customer.fullName}</h3>
                <p className="text-gray-600 text-sm">{customer.email}</p>
                {customer.phone && (
                  <p className="text-gray-600 text-sm">{customer.phone}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    customer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.isActive ? "Active" : "Locked"}
                </span>
                <button
                  onClick={() => {
                    if (customer.isActive) {
                      lockMutation.mutate(customer._id);
                    } else {
                      unlockMutation.mutate(customer._id);
                    }
                  }}
                  disabled={lockMutation.isPending || unlockMutation.isPending}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 transition text-sm"
                >
                  {customer.isActive ? "Lock" : "Unlock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {response && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Total: {response.total} customers
        </div>
      )}
    </div>
  );
}
