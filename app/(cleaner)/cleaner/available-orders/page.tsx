"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAvailableOrders, useApplyForOrder } from "@/hooks/useApi";

export default function AvailableOrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch } = useAvailableOrders();
  const { mutateAsync: applyForOrder, isPending: isApplying } =
    useApplyForOrder();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApply = async (orderId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      await applyForOrder(orderId);
      setSuccessMessage("Successfully applied for order!");
      refetch();
      setTimeout(() => router.push("/cleaner/jobs"), 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to apply for order";
      setErrorMessage(message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Available Orders</h1>
        <p className="text-gray-600">
          Browse and apply for cleaning assignments
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-gray-600">
          Loading available orders...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load available orders
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No available orders at the moment. Check back later!
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{order.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.scheduledDate).toLocaleDateString()} at{" "}
                    {order.scheduledTime}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {order.tasks?.length || 0} tasks
              </p>

              {order.note && (
                <p className="text-sm text-gray-500 mb-3 italic">
                  Note: {order.note}
                </p>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/orders/${order._id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleApply(order._id)}
                  disabled={isApplying}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Apply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/cleaner/jobs" className="text-blue-600 hover:underline">
          View My Jobs →
        </Link>
      </div>
    </div>
  );
}
