"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const [selectedCleanerId, setSelectedCleanerId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders", { status }],
    queryFn: async () => {
      const response = await apiClient.get("/admin/orders", {
        params: { status },
      });
      return response.data;
    },
  });

  const { data: cleaners } = useQuery({
    queryKey: ["admin", "cleaners"],
    queryFn: () => apiClient.get("/admin/cleaners"),
  });

  const assignMutation = useMutation({
    mutationFn: ({
      orderId,
      cleanerId,
    }: {
      orderId: string;
      cleanerId: string;
    }) =>
      apiClient.patch(`/admin/orders/${orderId}/assign-cleaner`, { cleanerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      setShowAssignModal(false);
      setSelectedOrderId(undefined);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) =>
      apiClient.patch(`/admin/orders/${orderId}/cancel`, {
        reason: "Cancelled by admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });

  const statusColors: any = {
    PENDING: "bg-gray-100 text-gray-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const statusOptions = [
    "PENDING",
    "ASSIGNED",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatus(undefined)}
          className={`px-4 py-2 rounded-lg transition ${
            !status
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg transition ${
              status === s
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {ordersLoading && (
        <div className="text-center py-8">Loading orders...</div>
      )}

      {orders?.orders && orders.orders.length === 0 && (
        <div className="text-center py-8 text-gray-600">No orders found</div>
      )}

      {orders?.orders && orders.orders.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Cleaner</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.orders.map((order: any) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{order.address}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.cleanerId ? "Assigned" : "Unassigned"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setShowAssignModal(true);
                      }}
                      disabled={
                        order.status === "COMPLETED" ||
                        order.status === "CANCELLED"
                      }
                      className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => cancelMutation.mutate(order._id)}
                      disabled={
                        order.status === "COMPLETED" ||
                        order.status === "CANCELLED"
                      }
                      className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Cleaner</h2>
            <select
              value={selectedCleanerId}
              onChange={(e) => setSelectedCleanerId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="">Select a cleaner...</option>
              {Array.isArray(cleaners)
                ? cleaners.map((cleaner: any) => (
                    <option key={cleaner._id} value={cleaner._id}>
                      {cleaner.fullName} ({cleaner.email})
                    </option>
                  ))
                : null}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (selectedOrderId && selectedCleanerId) {
                    assignMutation.mutate({
                      orderId: selectedOrderId,
                      cleanerId: selectedCleanerId,
                    });
                  }
                }}
                disabled={!selectedCleanerId || assignMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {assignMutation.isPending ? "Assigning..." : "Assign"}
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
