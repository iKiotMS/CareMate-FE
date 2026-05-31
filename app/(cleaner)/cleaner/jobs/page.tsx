"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCleanerJobs } from "@/hooks/useApi";

export default function CleanerJobsPage() {
  const router = useRouter();
  const { data: jobs, isLoading, error } = useCleanerJobs();

  const statusColors: any = {
    ASSIGNED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
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
        <h1 className="text-3xl font-bold mb-2">My Assigned Jobs</h1>
        <p className="text-gray-600">
          Manage and complete your cleaning assignments
        </p>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-600">Loading jobs...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load jobs
        </div>
      )}

      {jobs && jobs.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No jobs assigned yet. Check back later!
        </div>
      )}

      {jobs && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job: any) => (
            <Link
              key={job._id}
              href={`/cleaner/jobs/${job._id}`}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{job.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(job.scheduledDate).toLocaleDateString()} at{" "}
                    {job.scheduledTime}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[job.status]}`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {job.tasks?.length || 0} tasks
                {job.status === "IN_PROGRESS" && (
                  <span className="ml-2">
                    • {job.tasks?.filter((t: any) => t.isDone).length || 0} done
                  </span>
                )}
              </p>
              {job.note && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  Note: {job.note}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/cleaner/work-history"
          className="text-blue-600 hover:underline"
        >
          View Work History →
        </Link>
      </div>
    </div>
  );
}
