"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerOrders } from "@/hooks/useApi";

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const { data: orders, isLoading, error } = useCustomerOrders(status);

  const statusOptions = [
    "PENDING",
    "ASSIGNED",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];
  const statusColors: any = {
    PENDING: "bg-gray-100 text-gray-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
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
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link
          href="/customer/orders/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New Order
        </Link>
      </div>

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

      {isLoading && (
        <div className="text-center py-8 text-gray-600">Loading orders...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load orders
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No orders found.{" "}
          <Link
            href="/customer/orders/new"
            className="text-blue-600 hover:underline"
          >
            Create one now
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="grid gap-4">
          {orders.map((order: any) => (
            <Link
              key={order._id}
              href={`/customer/orders/${order._id}`}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{order.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.scheduledDate).toLocaleDateString()} at{" "}
                    {order.scheduledTime}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {order.tasks?.length || 0} tasks • Created{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
