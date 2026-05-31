"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCustomerOrderDetail,
  useCancelOrder,
  useSubmitReview,
} from "@/hooks/useApi";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: order, isLoading } = useCustomerOrderDetail(params.id);
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const { mutateAsync: submitReview } = useSubmitReview();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusColors: any = {
    PENDING: "bg-gray-100 text-gray-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrder({ orderId: params.id });
      router.push("/customer/orders");
    } catch (error) {
      alert("Failed to cancel order");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitReview({ orderId: params.id, rating, comment });
      setShowReviewForm(false);
      router.refresh();
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <div className="bg-white border border-gray-300 rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{order.address}</h1>
            <p className="text-gray-600">
              Order #{order._id.slice(-8)} • Created{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full font-semibold ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>

        {/* Schedule */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="font-semibold mb-3">Scheduled For</h2>
          <p className="text-lg">
            {new Date(order.scheduledDate).toLocaleDateString()} at{" "}
            {order.scheduledTime}
          </p>
        </div>

        {/* Tasks */}
        <div className="mb-6 pb-6 border-b">
          <h2 className="font-semibold mb-3">
            Tasks ({order.tasks?.length || 0})
          </h2>
          <ul className="space-y-2">
            {order.tasks?.map((task: any, idx: number) => (
              <li key={idx} className="flex items-center text-gray-700">
                <span
                  className={`${task.isDone ? "line-through text-gray-400" : ""}`}
                >
                  {task.taskName}
                </span>
                {task.isDone && <span className="ml-2 text-green-600">✓</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Photos */}
        {order.photosBeforeBooking && order.photosBeforeBooking.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="font-semibold mb-3">Before Cleaning Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              {order.photosBeforeBooking.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  alt="before"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {order.photosAfter && order.photosAfter.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="font-semibold mb-3">After Cleaning Photos</h2>
            <div className="grid grid-cols-3 gap-3">
              {order.photosAfter.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  alt="after"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Cleaner Info */}
        {order.cleanerId && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="font-semibold mb-2">Assigned Cleaner</h2>
            <p className="text-gray-700">
              (Cleaner name and details would appear here)
            </p>
          </div>
        )}

        {/* Notes */}
        {order.note && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="font-semibold mb-2">Special Instructions</h2>
            <p className="text-gray-700">{order.note}</p>
          </div>
        )}

        {/* Review Section */}
        {order.status === "COMPLETED" && !order.rating && (
          <div className="mb-6 pb-6 border-b bg-blue-50 p-4 rounded-lg">
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Leave a Review
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Rating *
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Very Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {order.rating && (
          <div className="mb-6 pb-6 border-b bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Your Review</h2>
            <p className="mb-1">Rating: {"⭐".repeat(order.rating)}</p>
            {order.review && <p className="text-gray-700">{order.review}</p>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {order.status === "PENDING" && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
