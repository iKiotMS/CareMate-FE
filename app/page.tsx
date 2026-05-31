"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🧹 Cleaning Service Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with professional cleaners and manage your cleaning services
            effortlessly
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">👨‍💼 For Customers</h3>
              <p className="text-gray-600">
                Book professional cleaners, track orders, and leave reviews.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">🧑‍🔧 For Cleaners</h3>
              <p className="text-gray-600">
                Accept jobs, execute tasks, and manage your work history.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">👨‍💼 For Admins</h3>
              <p className="text-gray-600">
                Manage users, assign jobs, and monitor service quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
