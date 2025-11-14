import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ComponentCard from "../common/ComponentCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";
import { Pencil, Trash2, X } from "lucide-react";

type StudentFormData = {
    name: string;
    last_name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    alt_phone: string;
    aadhar_number: string;
    pan_number: string;
    address: string;
    pincode: string;
    state: string;
    department: string;
    course: string;
    year_of_passed: string;
    experience: string;
    department_stream: string;
    course_duration: string;
    join_date: string;
    end_date: string;
    course_enrolled: string;
    batch: string;
    certificate_status: string;
    pan_card?: string;
    aadhar_card?: string;
    sslc_marksheet?: string;
    passport_photo_url?: string;
    certificate_url?: string; // ✅ Add this
    student_id?: string;
};

export default function CertificateStatus() {
    const { id } = useParams<{ id: string }>();
    const [student, setStudent] = useState<StudentFormData | null>(null);
    const [formData, setFormData] = useState({ certificate_status: "" });
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const fetchCertificate = async () => {
        if (!student?.student_id) return;
        try {
            const res = await axios.get(
                `https://nystai-backend.onrender.com/studentscertificates/${student.student_id}`
            );
            setCertificateUrl(res.data?.certificateUrl || null); // 🔹 fixed key
        } catch (err) {
            console.error("Failed to fetch certificate:", err);
        }
    };

    useEffect(() => {
        if (student?.student_id) {
            fetchCertificate();
        }
    }, [student]);

    useEffect(() => {
        if (id) {
            axios
                .get(`https://nystai-backend.onrender.com/single-student/${id}`)
                .then((res) => setStudent(res.data.data))
                .catch((err) => {
                    console.error("Fetch failed:", err);
                    setStudent(null);
                });
        }
    }, [id]);

    useEffect(() => {
        if (student) {
            setFormData({
                certificate_status: student.certificate_status || "",
            });
        }
    }, [student]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : date.toLocaleDateString("en-IN");
    };

    const handleSave = async () => {
        if (!student) return;

        const newStatus = formData.certificate_status;
        const oldStatus = student.certificate_status;

        if (newStatus === oldStatus) {
            toast.error("No change detected in certificate status.");
            return;
        }

        const updatedData = { ...student, certificate_status: newStatus };

        try {
            setSaving(true);
            await axios.put(
                `https://nystai-backend.onrender.com/update-student/${id}`,
                updatedData
            );

            const res = await axios.get(
                `https://nystai-backend.onrender.com/single-student/${id}`
            );
            const updated = res.data.data;

            if (updated.certificate_status === newStatus) {
                toast.success(" Certificate status updated successfully!");
                setStudent(updated);
            } else {
                toast.error("Update failed: certificate status not changed.");
            }
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                error.message ||
                "Unknown error";
            toast.error("Update failed: " + errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleUploadCertificate = async () => {
        if (!student?.student_id) {
            toast.error("No student ID found.");
            return;
        }
        if (!certificateFile) {
            toast.error("Please select a certificate file to upload.");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("certificate", certificateFile);

            await axios.post(
                `https://nystai-backend.onrender.com/studentscertificates/${student.student_id}/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success("Certificate uploaded successfully!");
            setCertificateFile(null);
            (document.getElementById("certificateInput") as HTMLInputElement).value = "";
            fetchCertificate(); // 🔹 refetch after upload

        } catch (error: any) {
            toast.error(
                "Upload failed: " + (error.response?.data?.message || error.message)
            );
        } finally {
            setUploading(false);
        }
    };

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({ ...prev, certificate_status: value }));
    };

    const handleEditCertificate = async () => {
        if (!student?.student_id || !certificateFile) {
            toast.error("Please select a new certificate to upload.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("certificate", certificateFile);

            await axios.put(
                `https://nystai-backend.onrender.com/studentscertificates/${student.student_id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            toast.success("Certificate updated!");
            setIsEditOpen(false);
            fetchCertificate();
        } catch (err: any) {
            toast.error("Update failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteCertificate = async () => {
        if (!student?.student_id) return;
        try {
            setIsDeleteLoading(true);
            await axios.delete(
                `https://nystai-backend.onrender.com/studentscertificates/${student.student_id}`
            );
            toast.success("Certificate deleted!");
            setCertificateUrl(null);
            setIsDeleteOpen(false);
        } catch (err: any) {
            toast.error("Delete failed: " + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
        <div className="flex">
            <span className="w-30 font-medium text-gray-500 dark:text-gray-400">
                {label}
            </span>
            <span className="w-10 font-medium text-gray-500 dark:text-gray-400">:</span>
            <span className="w-80 break-words whitespace-normal text-gray-800 dark:text-white/90">
                {value || "-"}
            </span>
        </div>
    );

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems."
            />
            <PageBreadcrumb
                pageTitle="Student Course Details"
                pageTitleLink="/studentlist"
                pageTitle1="Certificate Status"
            />

            <ComponentCard title="Certificate Status">
                <div className="flex flex-col items-center justify-center p-4">
                    {student ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800">
                            {/* Left Div - Profile Image */}
                            <div className="md:col-span-12 lg:col-span-3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
                                <div className="w-full h-[300px] overflow-hidden rounded-xl">
                                    <img
                                        src={
                                            student.passport_photo_url ||
                                            "https://via.placeholder.com/300"
                                        }
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Center Div - Profile Info */}
                            <div className="md:col-span-12 lg:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6">
                                <h1 className="font-semibold text-xl text-gray-800 dark:text-white/90">
                                    {student.name} {student.last_name}
                                </h1>
                                <InfoRow label="Student ID" value={student.student_id} />
                                <InfoRow label="Date of Birth" value={formatDate(student.dob)} />
                                <InfoRow label="Mail ID" value={student.email} />
                                <InfoRow label="Place" value={student.address} />
                                <InfoRow label="Aadhaar" value={student.aadhar_number} />
                                <InfoRow label="PAN" value={student.pan_number} />
                            </div>

                            {/* Right Div - Course Info */}
                            <div className="md:col-span-12 lg:col-span-4 space-y-4 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6">
                                <InfoRow label="Course" value={student.course} />
                                <InfoRow label="Batch" value={student.batch} />
                                <InfoRow
                                    label="Duration"
                                    value={`${student.course_duration} months`}
                                />
                                <InfoRow label="Start Date" value={formatDate(student.join_date)} />
                                <InfoRow label="End Date" value={formatDate(student.end_date)} />
                            </div>
                        </div>
                    ) : (
                        <p>Loading student data...</p>
                    )}

                    <div className="w-full max-w-xs mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Certificate Status
                        </label>
                        <CustomDropdown
                            options={["pending", "completed"]}
                            value={formData.certificate_status}
                            onSelect={handleStatusChange}
                        />
                    </div>

                    <div className="flex flex-row py-8 gap-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-6 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "SAVE"}
                        </button>
                    </div>

                    {student?.certificate_status === "completed" && (
                        <div className="mt-6 text-center space-y-4">
                            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                Upload Certificate
                            </h2>

                            <input
                                id="certificateInput"
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                    setCertificateFile(e.target.files?.[0] || null)
                                }
                                className="block w-full max-w-xs text-sm text-gray-700 border rounded-md p-2"
                            />
                            <button
                                onClick={handleUploadCertificate}
                                disabled={uploading}
                                className="mt-3 px-6 py-2 rounded-2xl bg-[#F8C723] text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    )}

                    {certificateUrl && (
                        <div className="mt-6 space-y-4 text-center">
                            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                Uploaded Certificate
                            </h2>
                            {certificateUrl.endsWith(".pdf") ? (
                                <iframe src={certificateUrl} className="w-full h-96 border rounded-md"></iframe>
                            ) : (
                                <img src={certificateUrl} alt="Certificate" className="w-auto h-64 mx-auto rounded-lg border" />
                            )}

                            <div className="flex justify-center gap-4 mt-4">
                                {/* Edit Button */}
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-6 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => setIsDeleteOpen(true)}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-6 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    )}

                    <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-lg m-4">
                        <div className="p-6 bg-white rounded-2xl">
                            <h3 className="text-lg font-semibold mb-4">Update Certificate</h3>

                            {/* Show existing certificate */}
                            {student?.certificate_url && (
                                <div className="mb-4">
                                    {student.certificate_url.endsWith(".pdf") ? (
                                        <a
                                            href={student.certificate_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            View Current Certificate (PDF)
                                        </a>
                                    ) : (
                                        <img
                                            src={student.certificate_url}
                                            alt="Current Certificate"
                                            className="w-full h-60 object-contain border rounded-md"
                                        />
                                    )}
                                </div>
                            )}

                            {/* File input for new certificate */}
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                                className="block w-full border p-2 rounded-md"
                            />

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={handleEditCertificate}
                                    className="px-4 py-2 bg-[#F8C723] text-white rounded-md"
                                >
                                    Update Certificate
                                </button>
                            </div>
                        </div>
                    </Modal>


                    <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-md m-4">
                        <div className="p-6 bg-white rounded-2xl">
                            <h4 className="text-xl font-semibold mb-6">Confirm Certificate Deletion</h4>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setIsDeleteOpen(false)}
                                    className="px-6 py-2 border rounded-md"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    onClick={handleDeleteCertificate}
                                    disabled={isDeleteLoading}
                                    className="px-6 py-2 bg-[#F8C723] text-white rounded-md"
                                >
                                    {isDeleteLoading ? "Deleting..." : "Yes, Delete"}
                                </button>

                            </div>
                        </div>
                    </Modal>

                </div>
            </ComponentCard>
        </>
    );
}

function CustomDropdown({
    label = "Select",
    options = [],
    value,
    onSelect,
}: {
    label?: string;
    options: string[];
    value: string;
    onSelect?: (value: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        setIsOpen(false);
        onSelect?.(val);
    };

    return (
        <div className="relative w-full max-w-xs" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="peer w-full rounded-md border border-gray-300 bg-[#F5F5F5] px-4 py-2.5 text-gray-700 flex justify-between items-center"
                type="button"
            >
                <span className="flex-1 text-left">{value || label}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border shadow-lg">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


