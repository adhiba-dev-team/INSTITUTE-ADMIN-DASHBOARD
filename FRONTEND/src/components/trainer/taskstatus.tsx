import { useState, useEffect } from "react";
import PageMeta from "../common/PageMeta.tsx";
import PageBreadcrumb from "../common/PageBreadCrumb.tsx";
import axios from "axios";
import { Eye, Download, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Taskstatus() {
    const { taskId, studentId } = useParams();
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [remark, setRemark] = useState("");
    const [sending, setSending] = useState(false);
    const [completed, setCompleted] = useState(false);

    const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
        <div className="flex mb-5">
            <span className="w-30 font-medium text-gray-500 dark:text-gray-400">{label}</span>
            <span className="w-10 font-medium text-gray-500 dark:text-gray-400">:</span>
            <span className="w-80 break-words whitespace-normal text-gray-800 dark:text-white/90">
                {value || "-"}
            </span>
        </div>
    );

    // ✅ Fetch uploaded student task
    useEffect(() => {
        if (!taskId || !studentId) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://nystai-backend.onrender.com/Students-Tasks/task/${taskId}/student/${studentId}/uploads`
                );

                if (response.data.success && response.data.uploads.length > 0) {
                    setStudentData(response.data.uploads[0]);
                }
            } catch (error) {
                console.error("Error fetching task details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskId, studentId]);

    // ✅ Send remark API
    const handleSendRemark = async () => {
        if (!remark.trim()) {
            toast.error("Please enter a remark before sending");
            return;
        }
        setSending(true);
        try {
            const res = await axios.put(   // <-- changed to PUT
                `https://nystai-backend.onrender.com/Students-Tasks/tasks/${taskId}/${studentId}/remark`,
                { remark }
            );
            if (res.data.success) {
                toast.success("Remark sent successfully!");
                setRemark(""); // clear after send
            } else {
                toast.error(res.data.message || "Failed to send remark");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send remark");
        } finally {
            setSending(false);
        }
    };


    // ✅ Mark completed API
    const handleMarkCompleted = async () => {
        setSending(true);
        try {
            const res = await axios.post(
                `https://nystai-backend.onrender.com/Students-Tasks/task/${taskId}/student/${studentId}/completed`,
                { notes: remark }
            );
            if (res.data.success) {
                toast.success("Task marked as completed!");
                setRemark("");
                setCompleted(true); // ✅ hide textarea + buttons
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to mark task as completed");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!studentData) return <p className="p-6">No data found</p>;

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems."
            />
            <PageBreadcrumb
                pageTitle={`Batch : ${studentData?.batch || ""}`}
                pageTitleLink="/Createtask"
                pageTitle1="Taskstatus"
            />

            <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="p-8 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-[#83838329]">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                                <div className="p-6 space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                                    {/* Task Details */}
                                    <div>
                                        <h1 className="font-semibold text-xl mb-12 text-gray-800 dark:text-white/90">
                                            Student & Assignment Details
                                        </h1>
                                        <InfoRow label="Student Name" value={`${studentData.name} ${studentData.last_name}`} />
                                        <InfoRow label="Batch" value={studentData.batch} />
                                        <InfoRow label="Course" value={studentData.course_enrolled} />
                                        <InfoRow label="Assignment" value={studentData.task_title} />
                                        <InfoRow
                                            label="Submitted At"
                                            value={studentData.submitted_at ? format(new Date(studentData.submitted_at), "MMM d, yyyy h:mm a") : "-"}
                                        />
                                        <InfoRow
                                            label="Due Date"
                                            value={studentData.due_date ? format(new Date(studentData.due_date), "MMM d, yyyy") : "-"}
                                        />
                                    </div>

                                    {/* Review Attachments */}
                                    <div>
                                        <h1 className="font-semibold text-xl mb-12 text-gray-800 dark:text-white/90">
                                            Review Attachments
                                        </h1>

                                        {studentData.file_url && (
                                            <div className="mt-6">
                                                <div className="bg-white w-fit dark:bg-gray-800 shadow-md border rounded-xl p-4">
                                                    <div className="flex items-center space-x-4 mb-6">
                                                        <FileText className="w-7 h-7 text-red-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                                Uploaded File
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3">
                                                        <a
                                                            href={studentData.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="rounded-2xl flex items-center gap-2 border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700"
                                                        >
                                                            <Eye className="w-4 h-4" /> View
                                                        </a>
                                                        <a
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                try {
                                                                    const response = await fetch(studentData.file_url);
                                                                    const blob = await response.blob();
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement("a");
                                                                    a.href = url;
                                                                    a.download = studentData.file_url.split("/").pop(); // file name
                                                                    document.body.appendChild(a);
                                                                    a.click();
                                                                    a.remove();
                                                                    window.URL.revokeObjectURL(url);
                                                                } catch (error) {
                                                                    console.error("Download failed", error);
                                                                }
                                                            }}
                                                            href={studentData.file_url}
                                                            className="rounded-2xl flex items-center gap-2 border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700"
                                                        >
                                                            <Download className="w-4 h-4" /> Download
                                                        </a>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remarks & Buttons */}
                    {!completed && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <h1 className="font-semibold text-xl mb-2 text-gray-800 dark:text-white/90">
                                    Remarks
                                </h1>
                            </div>

                            <div className="flex justify-center">
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder="Enter your notes or remark here..."
                                    className="bg-[#83838329] w-full max-w-6xl h-42 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90"
                                />
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleSendRemark}
                                    disabled={sending}
                                    className="flex items-center gap-2 border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {sending ? "Sending..." : "Send Notes"}
                                </button>
                                <button
                                    onClick={handleMarkCompleted}
                                    disabled={sending}
                                    className="flex items-center gap-2 border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {sending ? "Processing..." : "Completed"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
