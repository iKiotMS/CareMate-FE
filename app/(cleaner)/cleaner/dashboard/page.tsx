"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CleanerDashboard() {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/cleaner/available-orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">🔍 Available Orders</h3>
          <p className="text-gray-600">Browse and apply for new jobs</p>
        </Link>

        <Link
          href="/cleaner/jobs"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">🔧 My Jobs</h3>
          <p className="text-gray-600">View assigned cleaning jobs</p>
        </Link>

        <Link
          href="/cleaner/work-history"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">📊 Work History</h3>
          <p className="text-gray-600">View completed orders and reviews</p>
        </Link>

        <Link
          href="/cleaner/profile"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-bold mb-2">👤 My Profile</h3>
          <p className="text-gray-600">Update your profile information</p>
        </Link>
      </div>
    </div>
  );
}
