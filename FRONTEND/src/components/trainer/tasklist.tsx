import { useState, useEffect } from "react";
import PageMeta from "../common/PageMeta.tsx";
import PageBreadcrumb from "../common/PageBreadCrumb.tsx";
import Label from "../form/Label.tsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

interface TaskMail {
    student_id: number;
    name: string;
    last_name: string;
    passport_photo_url: string;
    course_enrolled: string;
    batch: string;
    email_status: string;
    sent_at: string;
    task_title: string;
}

interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
    email: string;
    submitted_at: string;
    course_enrolled?: string;
    task_title?: string;
    passport_photo_url?: string;
}

const studentPlaceholder = "/placeholder.png";

export default function Tasklist() {
    const { taskId } = useParams<{ taskId: string }>();
    const [mails, setMails] = useState<TaskMail[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [completed, setCompleted] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch uploaded submissions
    useEffect(() => {
        const fetchAllTaskSubmissions = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://nystai-backend.onrender.com/Students-Tasks/task/${taskId}/submissions`
                );

                if (res.data.success) {
                    setStudents(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        if (taskId) fetchAllTaskSubmissions();
    }, [taskId]);

    // Fetch mails
    useEffect(() => {
        const fetchTaskMails = async () => {
            if (!taskId) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    `https://nystai-backend.onrender.com/Students-Tasks/task/${taskId}/mailsent`
                );
                if (response.data.success) {
                    setMails(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching task mails:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskMails();
    }, [taskId]);

    // Fetch completed students
    useEffect(() => {
        const fetchCompletedStudents = async () => {
            if (!taskId) return;
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://nystai-backend.onrender.com/Students-Tasks/task/${taskId}/completed`
                );
                if (res.data.success) {
                    setCompleted(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching completed students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedStudents();
    }, [taskId]);

    const taskInfo = mails[0];

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems."
            />
            <PageBreadcrumb
                pageTitle="Create Assignments"
                pageTitleLink="/Createtask"
                pageTitle1={`Batch : ${taskInfo?.batch || ""}`}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6">
                <h2 className="text-xl font-semibold">Batch: {taskInfo?.batch}</h2>
                <h3 className="text-lg font-semibold mb-12">{taskInfo?.task_title}</h3>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Assigned Section */}
                    <div>
                        <Label className="mb-5 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            Task Assigned To Students
                            <span className="flex items-center justify-center w-6 h-6 text-white text-sm font-semibold rounded-full bg-[#222]">
                                {mails.length}
                            </span>
                        </Label>

                        {loading && (
                            <p className="text-blue-500 font-semibold">Loading...</p>
                        )}


                        {mails.length === 0 ? (
                            <p className="text-red-500">No emails found</p>
                        ) : (
                            mails.map((mail) => (
                                <div
                                    key={mail.student_id}
                                    className="border p-4 shadow-sm mb-3 hover:bg-[#FFDD68ac] transition cursor-pointer"
                                >
                                    <h3 className="text-base font-semibold mb-3">
                                        {mail.course_enrolled}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={mail.passport_photo_url || studentPlaceholder}
                                                alt={mail.name}
                                            />
                                            <span>
                                                {mail.name} {mail.last_name}
                                            </span>
                                        </div>
                                        <span>{format(new Date(mail.sent_at), "MMM d")}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Uploaded Section */}
                    <div>
                        <Label className="mb-5 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                            Uploaded
                            <span className="flex items-center justify-center w-6 h-6 text-white text-sm font-semibold rounded-full bg-[#222]">
                                {students.length}
                            </span>
                        </Label>

                        {students.length === 0 ? (
                            <p>No submissions yet</p>
                        ) : (
                            students.map((student) => (
                                <div
                                    key={student.student_id}
                                    onClick={() =>
                                        navigate(`/task/${taskId}/student/${student.student_id}`)
                                    }
                                    className="border p-4 shadow-sm mb-3 hover:bg-[#FFDD68ac] transition cursor-pointer"
                                >
                                    <h3 className="text-base font-semibold mb-3">
                                        {student.course_enrolled || "-"} -{" "}
                                        {student.task_title || "-"}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={student.passport_photo_url || studentPlaceholder}
                                                alt={`${student.first_name} ${student.last_name}`}
                                            />
                                            <span>
                                                {student.first_name} {student.last_name}
                                            </span>
                                        </div>
                                        <span>
                                            {student.submitted_at
                                                ? format(new Date(student.submitted_at), "MMM d")
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ✅ Completed Section */}
                    <div>
                        <Label className="mb-5 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Completed
                            <span className="flex items-center justify-center w-6 h-6 text-white text-sm font-semibold rounded-full bg-[#222]">
                                {completed.length}
                            </span>
                        </Label>

                        {completed.length === 0 ? (
                            <p>No one completed yet</p>
                        ) : (
                            completed.map((student) => (
                                <div
                                    key={student.student_id}
                                    onClick={() =>
                                        navigate(`/task/${taskId}/student/${student.student_id}`)
                                    }
                                    className="border p-4 shadow-sm mb-3 hover:bg-[#FFDD68ac] transition cursor-pointer"
                                >
                                    <h3 className="text-base font-semibold mb-3">
                                        {student.course_enrolled || "-"} -{" "}
                                        {student.task_title || "-"}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="w-10 h-10 rounded-full"
                                                src={student.passport_photo_url || studentPlaceholder}
                                                alt={`${student.first_name} ${student.last_name}`}
                                            />
                                            <span>
                                                {student.first_name} {student.last_name}
                                            </span>
                                        </div>
                                        <span>
                                            {student.submitted_at
                                                ? format(new Date(student.submitted_at), "MMM d")
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
