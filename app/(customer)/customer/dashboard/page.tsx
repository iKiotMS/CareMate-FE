"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/customer/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">📋 My Orders</h3>
          <p className="text-gray-600">View and manage your cleaning orders</p>
        </Link>

        <Link
          href="/customer/orders/new"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">➕ Create Order</h3>
          <p className="text-gray-600">Book a new cleaning service</p>
        </Link>

        <Link
          href="/customer/profile"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">👤 My Profile</h3>
          <p className="text-gray-600">Update your profile information</p>
        </Link>
      </div>
    </div>
  );
}
