"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard/stats");
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-8 text-gray-600">Loading dashboard...</div>
    );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-blue-600">
            {response?.total || 0}
          </h3>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-green-600">
            {response?.COMPLETED || 0}
          </h3>
          <p className="text-gray-600">Completed Orders</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-yellow-600">
            {response?.IN_PROGRESS || 0}
          </h3>
          <p className="text-gray-600">In Progress</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-purple-600">
            {response?.totalCustomers || 0}
          </h3>
          <p className="text-gray-600">Total Customers</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-indigo-600">
            {response?.totalCleaners || 0}
          </h3>
          <p className="text-gray-600">Total Cleaners</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Management</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-2">📋 Manage Orders</h3>
          <p className="text-gray-600">View all orders and assign cleaners</p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-2">👥 Customers</h3>
          <p className="text-gray-600">Manage customer accounts</p>
        </Link>

        <Link
          href="/admin/cleaners"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-2">🧹 Cleaners</h3>
          <p className="text-gray-600">Manage cleaner accounts</p>
        </Link>

        <Link
          href="/admin/tasks"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border border-gray-200"
        >
          <h3 className="text-xl font-bold mb-2">⚙️ Task Catalog</h3>
          <p className="text-gray-600">Manage cleaning tasks</p>
        </Link>
      </div>
    </div>
  );
}
