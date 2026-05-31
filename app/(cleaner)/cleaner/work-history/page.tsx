"use client";

import Link from "next/link";
import { useCleanerWorkHistory } from "@/hooks/useApi";

export default function WorkHistoryPage() {
  const { data: completedOrders, isLoading, error } = useCleanerWorkHistory();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Work History</h1>
        <p className="text-gray-600">Completed jobs and customer reviews</p>
      </div>

      <Link
        href="/cleaner/jobs"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Active Jobs
      </Link>

      {isLoading && (
        <div className="text-center py-8 text-gray-600">
          Loading work history...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load work history
        </div>
      )}

      {completedOrders && completedOrders.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No completed jobs yet. Start accepting jobs to build your history!
        </div>
      )}

      {completedOrders && completedOrders.length > 0 && (
        <div className="grid gap-4">
          {completedOrders.map((order: any) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg p-4 bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{order.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.scheduledDate).toLocaleDateString()} •
                    Completed {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  COMPLETED
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {order.tasks?.length || 0} tasks completed
              </p>

              {/* Customer Review */}
              {order.rating ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-yellow-500">
                      {"⭐".repeat(order.rating)}
                    </span>
                    <span className="text-gray-600 text-sm ml-2">
                      ({order.rating}/5 stars)
                    </span>
                  </div>
                  {order.review && (
                    <p className="text-gray-700 text-sm">{order.review}</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
                  <p className="text-gray-600 text-sm">
                    No review submitted yet
                  </p>
                </div>
              )}

              {/* Photos */}
              {order.photosAfter && order.photosAfter.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold mb-2">
                    After Cleaning Photos
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {order.photosAfter
                      .slice(0, 4)
                      .map((url: string, idx: number) => (
                        <img
                          key={idx}
                          src={url}
                          alt="completed work"
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
