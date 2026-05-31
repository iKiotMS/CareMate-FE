"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCleanerJobDetail,
  useAcceptJob,
  useCheckInJob,
  useMarkTaskDone,
  useCompleteJob,
  useUploadPhotos,
} from "@/hooks/useApi";

export default function JobExecutionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: job, isLoading, refetch } = useCleanerJobDetail(params.id);

  const { mutateAsync: acceptJob, isPending: isAccepting } = useAcceptJob();
  const { mutateAsync: checkInJob, isPending: isCheckingIn } = useCheckInJob();
  const { mutateAsync: markTaskDone, isPending: isMarkingTask } =
    useMarkTaskDone();
  const { mutateAsync: completeJob, isPending: isCompleting } =
    useCompleteJob();
  const { mutateAsync: uploadPhotos } = useUploadPhotos();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<{
    checkin?: string[];
    taskPhotos?: { [taskId: string]: { before?: string; after?: string } };
  }>({
    taskPhotos: {},
  });
  const [error, setError] = useState("");
  const [currentTaskPhotoType, setCurrentTaskPhotoType] = useState<{
    taskId: string;
    type: "before" | "after";
  } | null>(null);

  const handleAccept = async () => {
    try {
      setError("");
      await acceptJob(params.id);
      await refetch();
    } catch (err) {
      setError("Failed to accept job");
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleUploadPhotos = async (
    type: "checkin" | "taskBefore" | "taskAfter",
    taskId?: string,
  ) => {
    if (selectedFiles.length === 0) return;
    try {
      setError("");
      const result: any = await uploadPhotos(selectedFiles);
      const photoUrls = result.urls || result.data?.urls || [];

      if (type === "checkin") {
        setUploadedPhotos((prev) => ({
          ...prev,
          checkin: photoUrls,
        }));
      } else if (taskId) {
        setUploadedPhotos((prev) => ({
          ...prev,
          taskPhotos: {
            ...prev.taskPhotos,
            [taskId]: {
              ...(prev.taskPhotos?.[taskId] || {}),
              [type === "taskBefore" ? "before" : "after"]: photoUrls[0],
            },
          },
        }));
      }
      setSelectedFiles([]);
      setCurrentTaskPhotoType(null);
    } catch (err: any) {
      setError("Failed to upload photos");
    }
  };

  const handleCheckIn = async () => {
    if (!uploadedPhotos.checkin || uploadedPhotos.checkin.length === 0) {
      setError("Please upload at least one check-in photo");
      return;
    }
    try {
      setError("");
      await checkInJob({ jobId: params.id, photos: uploadedPhotos.checkin });
      await refetch();
    } catch (err) {
      setError("Failed to check in");
    }
  };

  const handleMarkTaskDone = async (taskCatalogId: string) => {
    try {
      setError("");
      const taskPhotos = uploadedPhotos.taskPhotos?.[taskCatalogId];
      await markTaskDone({
        jobId: params.id,
        taskCatalogId,
        photoBefore: taskPhotos?.before,
        photoAfter: taskPhotos?.after,
      });
      await refetch();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to mark task done");
    }
  };

  const handleComplete = async () => {
    try {
      setError("");
      await completeJob(params.id);
      router.push("/cleaner/work-history");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to complete job");
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!job) return <div className="text-center py-8">Job not found</div>;

  const statusFlow = ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "REVIEW_PENDING"];
  const currentStepIndex = statusFlow.indexOf(job.status);
  const allTasksDone = job.tasks?.every((t: any) => t.isDone);
  const allTasksHavePhotos = job.tasks?.every(
    (t: any) =>
      uploadedPhotos.taskPhotos?.[t.taskCatalogId]?.before &&
      uploadedPhotos.taskPhotos?.[t.taskCatalogId]?.after,
  );

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
        <h1 className="text-3xl font-bold mb-2">{job.address}</h1>
        <p className="text-gray-600 mb-6">
          {new Date(job.scheduledDate).toLocaleDateString()} at{" "}
          {job.scheduledTime}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Status Flow */}
        <div className="mb-8 pb-8 border-b">
          <div className="flex justify-between items-center">
            {statusFlow.map((status, idx) => (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                    idx <= currentStepIndex
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {idx < currentStepIndex ? "✓" : idx + 1}
                </div>
                <span className="text-xs text-center">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Notes */}
        {job.note && (
          <div className="mb-8 pb-8 border-b bg-blue-50 p-4 rounded">
            <h2 className="font-semibold mb-2">Customer Notes</h2>
            <p className="text-gray-700">{job.note}</p>
          </div>
        )}

        {/* Customer Before Photos */}
        {job.photosBeforeBooking && job.photosBeforeBooking.length > 0 && (
          <div className="mb-8 pb-8 border-b">
            <h2 className="font-semibold mb-3">Customer's Before Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {job.photosBeforeBooking.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  alt="customer before"
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Step: Accept Job */}
        {job.status === "ASSIGNED" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">Step 1: Accept Job</h2>
            <p className="text-gray-700 mb-4">
              Review the job details above and accept to proceed.
            </p>
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isAccepting ? "Accepting..." : "Accept Job"}
            </button>
          </div>
        )}

        {/* Step: Check-In */}
        {job.status === "ACCEPTED" && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">Step 2: Check-In On-Site</h2>
            <p className="text-gray-700 mb-4">
              Upload photos of the current state before starting work.
            </p>
            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer"
              />
            </div>
            {selectedFiles.length > 0 && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => handleUploadPhotos("checkin")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Upload {selectedFiles.length} Photo(s)
                </button>
              </div>
            )}
            {uploadedPhotos.checkin && uploadedPhotos.checkin.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-green-700 font-semibold mb-2">
                  Check-in photos uploaded!
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {uploadedPhotos.checkin.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt="checkin"
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 transition"
                >
                  {isCheckingIn ? "Checking In..." : "Check In & Start Work"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: Work Progress with Per-Task Photos */}
        {(job.status === "IN_PROGRESS" || job.status === "REVIEW_PENDING") && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">
              Step 3: Complete Tasks with Photos
            </h2>
            <p className="text-gray-700 mb-4">
              {job.tasks?.filter((t: any) => t.isDone).length}/
              {job.tasks?.length} tasks completed
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(job.tasks?.filter((t: any) => t.isDone).length / job.tasks?.length) * 100}%`,
                }}
              />
            </div>

            {/* Tasks with Photo Upload */}
            <div className="space-y-4">
              {job.tasks?.map((task: any) => {
                const taskPhotos =
                  uploadedPhotos.taskPhotos?.[task.taskCatalogId];
                return (
                  <div
                    key={task.taskCatalogId}
                    className="border border-gray-300 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.taskName}</h3>
                        <div className="flex gap-4 mt-2">
                          {/* Before Photo */}
                          <div className="text-sm">
                            <p className="text-gray-600 mb-1">Before Photo:</p>
                            {taskPhotos?.before ? (
                              <img
                                src={taskPhotos.before}
                                alt="before"
                                className="w-20 h-20 object-cover rounded border border-gray-300"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                No photo
                              </div>
                            )}
                          </div>

                          {/* After Photo */}
                          <div className="text-sm">
                            <p className="text-gray-600 mb-1">After Photo:</p>
                            {taskPhotos?.after ? (
                              <img
                                src={taskPhotos.after}
                                alt="after"
                                className="w-20 h-20 object-cover rounded border border-gray-300"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                No photo
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={
                            job.status !== "IN_PROGRESS" ||
                            !taskPhotos?.before ||
                            !taskPhotos?.after
                          }
                          checked={task.isDone}
                          onChange={() =>
                            handleMarkTaskDone(task.taskCatalogId)
                          }
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        {task.isDone && (
                          <span className="ml-2 text-green-600 font-semibold">
                            ✓
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Photo Upload Section */}
                    {job.status === "IN_PROGRESS" && !task.isDone && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {/* Before Photo Upload */}
                        {!taskPhotos?.before && (
                          <div>
                            <label className="text-sm text-gray-700 block mb-1">
                              Upload Before Photo
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                disabled={
                                  currentTaskPhotoType?.taskId ===
                                    task.taskCatalogId &&
                                  currentTaskPhotoType?.type === "before"
                                }
                                className="block flex-1 text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer"
                              />
                              {selectedFiles.length > 0 &&
                                currentTaskPhotoType?.taskId ===
                                  task.taskCatalogId &&
                                currentTaskPhotoType?.type === "before" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUploadPhotos(
                                        "taskBefore",
                                        task.taskCatalogId,
                                      )
                                    }
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                  >
                                    Upload
                                  </button>
                                )}
                            </div>
                          </div>
                        )}

                        {/* After Photo Upload */}
                        {taskPhotos?.before && !taskPhotos?.after && (
                          <div>
                            <label className="text-sm text-gray-700 block mb-1">
                              Upload After Photo
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                disabled={
                                  currentTaskPhotoType?.taskId ===
                                    task.taskCatalogId &&
                                  currentTaskPhotoType?.type === "after"
                                }
                                className="block flex-1 text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer"
                              />
                              {selectedFiles.length > 0 &&
                                currentTaskPhotoType?.taskId ===
                                  task.taskCatalogId &&
                                currentTaskPhotoType?.type === "after" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUploadPhotos(
                                        "taskAfter",
                                        task.taskCatalogId,
                                      )
                                    }
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                  >
                                    Upload
                                  </button>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: Complete Job */}
        {job.status === "IN_PROGRESS" && allTasksDone && allTasksHavePhotos && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-3">Step 4: Complete Job</h2>
            <p className="text-gray-700 mb-4">
              All tasks completed with photos! Click below to finish the job.
            </p>
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
            >
              {isCompleting ? "Completing..." : "Complete Job"}
            </button>
          </div>
        )}

        {/* Completed */}
        {(job.status === "REVIEW_PENDING" || job.status === "COMPLETED") && (
          <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              ✓ Job completed successfully! Awaiting customer review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
