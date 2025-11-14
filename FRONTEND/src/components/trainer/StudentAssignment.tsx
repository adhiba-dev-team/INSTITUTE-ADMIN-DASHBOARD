import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface AssignmentData {
    task_id: string;
    student_id?: string;
    htmlContent?: string;
    [key: string]: any;
}

function StudentAssignment() {
    const { token, studentId: urlStudentId } = useParams<{
        token: string;
        studentId?: string;
    }>();

    const [file, setFile] = useState<File | null>(null);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [assignmentContent, setAssignmentContent] = useState<string>("");

    // Fetch assignment info
    useEffect(() => {
        if (!token) return;

        fetch(
            `https://nystai-backend.onrender.com/Students-Tasks/assignment/${token}`
        )
            .then(async (res) => {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return res.json();
                } else {
                    const text = await res.text();
                    throw new Error("Expected JSON but got: " + text);
                }
            })
            .then((data: AssignmentData) => {
                const finalStudentId = urlStudentId || data.student_id;
                if (!finalStudentId) {
                    toast.error("Student ID not found!");
                } else {
                    setStudentId(finalStudentId);
                }

                if (data.htmlContent) {
                    setAssignmentContent(data.htmlContent);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch assignment:", err);
                toast.error("Failed to fetch assignment details");
            });
    }, [token, urlStudentId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file before submitting.");
        if (!studentId) return toast.error("Student ID not found.");

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            const uploadUrl = `https://nystai-backend.onrender.com/Students-Tasks/assignment/submit/${token}/${studentId}`;

            const res = await fetch(uploadUrl, { method: "POST", body: formData });

            if (res.ok) {
                await res.json();
                toast.success("Assignment submitted successfully ✅");
                setFile(null);
            } else {
                toast.error("Failed to submit assignment");
            }
        } catch (err) {
            toast.error("Error submitting assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                background: "#fafafa",
            }}
        >
            <Toaster position="top-right" />
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                📚 Student Assignment
            </h2>

            {/* Assignment Details (default layout if no htmlContent from backend) */}
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                }}
            >
                {assignmentContent ? (
                    <div dangerouslySetInnerHTML={{ __html: assignmentContent }} />
                ) : (
                    <>
                        <p>
                            <strong>📌 Course:</strong> System Integration Program
                        </p>
                        <p>
                            <strong>📝 New Assignment:</strong> System Integration - Module 1
                        </p>
                        <p>
                            <strong>📅 Due by:</strong> 12-Aug-2025
                        </p>
                        <p>
                            <strong>Description:</strong>
                            <br />
                            MQTT follows the publish-subscribe model, where clients
                            communicate with a central server called a broker. This
                            architecture powers HiveMQ’s IoT data streaming platform, creating
                            the reliable foundation needed for enterprise data exchange.
                        </p>

                        <div style={{ margin: "15px 0" }}>
                            <strong>📎 Attachments:</strong>
                            <div
                                style={{
                                    border: "2px dashed #bbb",
                                    padding: "20px",
                                    marginTop: "10px",
                                    borderRadius: "6px",
                                    textAlign: "center",
                                    color: "#555",
                                }}
                            >
                                Drag & drop files here or{" "}
                                <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                                    Browse
                                </span>
                                <br />
                                <small>
                                    Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word,
                                    PPT
                                </small>
                            </div>
                        </div>

                        <p>
                            <strong>📤 Submission Method:</strong> Please upload your
                            assignment via the student dashboard before the deadline.
                        </p>
                        <p>
                            <strong>⚠️ Note:</strong> This task is important for progressing
                            to the next module. Kindly ensure timely submission.
                        </p>
                        <p>
                            If you have any questions, feel free to reach out to your trainer
                            or reply to this email.
                        </p>
                    </>
                )}
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="file"
                    name="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    required
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        marginBottom: "12px",
                        cursor: "pointer",
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: loading ? "#95a5a6" : "#27ae60",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                    }}
                >
                    {loading ? "Submitting..." : "📤 Submit Assignment"}
                </button>
            </form>
        </div>
    );
}

export default StudentAssignment;
