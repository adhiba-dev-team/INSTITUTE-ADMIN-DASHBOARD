import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Trash2, Pencil, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";

interface Course {
    course_id?: string; // from backend (optional if not always sent)
    course_name: string;
    course_duration: string;
    card_overview: string;
    image_url?: string;
    price?: number; // or string depending on your backend
    point_1?: string;
    point_2?: string;
    point_3?: string;
    point_4?: string;
    point_5?: string;
    point_6?: string;
    point_7?: string;
}

interface EditErrors {
    name?: string;
    duration?: string;
    overview?: string;
    image_url?: string;
}


export default function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    type Points = Record<`point_${number}`, string>;

    const [editPoints, setEditPoints] = useState<Points>({
        point_1: "",
        point_2: "",
        point_3: "",
        point_4: "",
        point_5: "",
    });

    const [editDuration, setEditDuration] = useState("");
    const [editOverview, setEditOverview] = useState("");
    const [editErrors, setEditErrors] = useState<EditErrors>({
        name: "",
        duration: "",
        overview: "",
        image_url: "",
    });

    const [editFile, setEditFile] = useState<File | null>(null);
    const [editFileUrl, setEditFileUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const res = await fetch(
                    `https://nystai-backend.onrender.com/Allcourses/get-course-with-plan/${id}`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch course");
                }
                const result = await res.json();
                if (result.success && result.data) {
                    // handle both array and object responses
                    const courseData = Array.isArray(result.data)
                        ? result.data[0]
                        : result.data;
                    setCourse(courseData);
                } else {
                    setCourse(null);
                    toast.error("Course not found");
                }

            } catch (error) {
                console.error("Failed to fetch course detail:", error);
                toast.error("Failed to fetch course details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCourseDetail();
    }, [id]);


    useEffect(() => {
        if (course) {
            setEditName(course.course_name || "");
            setEditDuration(course.course_duration?.toString() || "");
            setEditOverview(course.card_overview || "");
            setEditFile(null);
            setEditFileUrl(course.image_url || null);
            setEditPrice(course.price?.toString() || "");
            setEditPoints({
                point_1: course.point_1 || "",
                point_2: course.point_2 || "",
                point_3: course.point_3 || "",
                point_4: course.point_4 || "",
                point_5: course.point_5 || "",
                point_6: course.point_6 || "",
                point_7: course.point_7 || "",
            });
        }
    }, [course]);


    const openDeleteModal = () => setIsDeleteOpen(true);
    const closeDeleteModal = () => setIsDeleteOpen(false);
    const openEditModal = () => setIsEditOpen(true);
    const closeEditModal = () => {
        setIsEditOpen(false);
        setEditErrors({
            name: "",
            duration: "",
            overview: "",
            image_url: "",
        });
    };

    const handleDelete = async () => {
        try {
            setDeleting(true); // only the button shows loading
            const res = await fetch(
                `https://nystai-backend.onrender.com/Allcourses/delete-course-with-plan/${id}`,
                { method: "DELETE" }
            );

            if (res.ok) {
                toast.success("Course deleted successfully");
                closeDeleteModal();
                navigate("/Courses");
            } else {
                toast.error("Failed to delete course");
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
        }
    };

    const validateEditForm = () => {
        let formErrors: EditErrors = {
            name: "",
            duration: "",
            overview: "",
            image_url: "",
        };

        if (!editName.trim()) {
            formErrors.name = "Course name is required";
        } else if (!/^[A-Za-z\s]+$/.test(editName)) {
            formErrors.name = "Course name must contain only letters and spaces";
        }

        const durationNum = parseInt(editDuration, 10);
        if (!editDuration.trim()) {
            formErrors.duration = "Course duration is required";
        } else if (
            !/^\d+$/.test(editDuration) ||
            durationNum < 1 ||
            durationNum > 365
        ) {
            formErrors.duration = "Duration must be a number between 1 and 365";
        }

        if (!editOverview.trim()) {
            formErrors.overview = "Course overview is required";
        } else if (editOverview.trim().split(/\s+/).length > 150) {
            formErrors.overview = "Overview must not exceed 150 words";
        }

        if (editFile) {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/jpg",
            ];
            if (!allowedTypes.includes(editFile.type)) {
                formErrors.image_url =
                    "Only JPG, PNG, or WebP images are allowed.";
            }
            if (editFile.size > 2 * 1024 * 1024) {
                formErrors.image_url = "Image size must be less than 2MB.";
            }
        }

        setEditErrors(formErrors);
        return (
            !formErrors.name &&
            !formErrors.duration &&
            !formErrors.overview &&
            !formErrors.image_url
        );
    };

    const handleSave = async () => {
        if (!validateEditForm()) return;
        setSaving(true);

        const formData = new FormData();
        formData.append("course_name", editName);
        formData.append("course_duration", editDuration);
        formData.append("card_overview", editOverview);
        formData.append("price", editPrice);

        // append all non-empty points
        Object.entries(editPoints).forEach(([key, value]) => {
            if (value?.trim()) formData.append(key, value);
        });

        if (editFile) {
            formData.append("image_url", editFile);
        }

        try {
            const res = await fetch(
                `https://nystai-backend.onrender.com/Allcourses/update-course-with-plan/${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Failed to update course & plan");
                setSaving(false);
                return;
            }

            toast.success("Course & pricing plan updated successfully");
            closeEditModal();

            // refetch updated data
            const updatedRes = await fetch(
                `https://nystai-backend.onrender.com/Allcourses/get-course-with-plan/${id}`
            );
            const updatedResult = await updatedRes.json();
            if (updatedResult.success && updatedResult.data) {
                const updatedData = Array.isArray(updatedResult.data)
                    ? updatedResult.data[0]
                    : updatedResult.data;
                setCourse(updatedData);
            }
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Something went wrong while saving");
        } finally {
            setSaving(false);
        }
    };


    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
            />
            <PageBreadcrumb
                pageTitle="Courses"
                pageTitleLink="/Courses"
                pageTitle1={course?.course_name || ""}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {loading ? (
                    <div className="text-center p-6">
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            Loading course details...
                        </span>
                    </div>
                ) : !course ? (
                    <div className="text-center p-6">
                        <span className="text-lg font-medium text-red-500">
                            Course not found.
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex items-center justify-between lg:mb-7">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                {course.course_name}
                            </h3>
                            <div className="flex flex-row gap-6">
                                <button
                                    onClick={openDeleteModal}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>

                                <button
                                    onClick={openEditModal}
                                    className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit Course
                                </button>
                            </div>
                        </div>

                        {/* Delete Modal */}
                        {isDeleteOpen && (
                            <Modal
                                isOpen={isDeleteOpen}
                                onClose={closeDeleteModal}
                                className="max-w-md m-4"
                                aria-label="Confirm Delete Course Modal"
                            >
                                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900">
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-8">
                                        Confirm Course Deletion
                                    </h4>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className={`flex items-center gap-2 rounded-2xl border border-gray-300 px-10 py-2 text-sm font-medium shadow-theme-xs ${deleting
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-[#F8C723] text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                                }`}
                                        >
                                            {deleting ? "Deleting..." : "Yes, Delete Course"}
                                        </button>
                                        <button
                                            onClick={closeDeleteModal}
                                            className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
                                            aria-label="Cancel Delete"
                                        >
                                            <X size={18} className="text-[#F8C723]" />
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        )}

                        {/* Edit Modal */}
                        {isEditOpen && (
                            <Modal
                                isOpen={isEditOpen}
                                onClose={closeEditModal}
                                className="max-w-[700px] m-4"
                                aria-label="Edit Course Modal"
                            >
                                        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                                Edit Course Form
                                            </h4>
                                            <form
                                                className="flex flex-col mt-5"
                                                onSubmit={(e) => e.preventDefault()}
                                                noValidate
                                            >
                                                <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                                        <div>
                                                            <Label className="mb-3">Course Name</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="System Integration Program"
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                minLength={3}
                                                                maxLength={20}
                                                            />
                                                            {editErrors.name && (
                                                                <p className="text-red-500 text-sm">{editErrors.name}</p>
                                                            )}
                                                        </div>


                                                        <div>
                                                            <Label className="mb-3">Course Duration</Label>
                                                            <Input
                                                                type="text"
                                                                placeholder="7 Days"
                                                                value={editDuration}
                                                                onChange={(e) => setEditDuration(e.target.value)}
                                                            />
                                                            {editErrors.duration && (
                                                                <p className="text-red-500 text-sm">
                                                                    {editErrors.duration}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="lg:col-span-2">
                                                            <Label className="mb-3">Course Overview</Label>
                                                            <textarea
                                                                value={editOverview}
                                                                onChange={(e) => setEditOverview(e.target.value)}
                                                                placeholder="Overview here"
                                                                className="w-full border rounded-2xl border-gray-300 px-3 py-2 h-[200px] resize-none text-sm text-gray-700"
                                                            />
                                                            {editErrors.overview && (
                                                                <p className="text-red-500 text-sm">
                                                                    {editErrors.overview}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="lg:col-span-2">
                                                            <Label className="mb-3">Course Price</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="4999"
                                                                value={editPrice}
                                                                onChange={(e) => setEditPrice(e.target.value)}
                                                            />
                                                        </div>

                                                        {[1, 2, 3, 4, 5].map((i) => {
                                                            const key = `point_${i}` as keyof Points;
                                                            return (
                                                                <div key={i} className="lg:col-span-2">
                                                                    <Label className="mb-3">Point {i}</Label>
                                                                    <Input
                                                                        type="text"
                                                                        placeholder={`Point ${i}`}
                                                                        value={editPoints[key]}
                                                                        onChange={(e) =>
                                                                            setEditPoints((prev) => ({ ...prev, [key]: e.target.value }))
                                                                        }
                                                                    />
                                                                </div>
                                                            );
                                                        })}

                                                        <div className="lg:col-span-2">
                                                            <Label className="mb-3">Upload Images</Label>
                                                            <FileUploadBox
                                                                selectedFile={editFile}
                                                                setSelectedFile={setEditFile}
                                                                existingFileUrl={editFileUrl}
                                                                clearExistingFile={() => setEditFileUrl(null)}
                                                            />
                                                            {editErrors.image_url && (
                                                                <p className="text-red-500 text-sm">
                                                                    {editErrors.image_url}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                                    <button
                                                        onClick={closeEditModal}
                                                        type="button"
                                                        className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
                                                        aria-label="Cancel editing course"
                                                        disabled={saving}
                                                    >
                                                        <ArrowLeft className="size-5 text-[#F8C723]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-20 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        aria-label="Save course edits"
                                                    >
                                                        {saving ? "Saving..." : "Edit Course"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                            </Modal>
                        )}

                        {/* Course Content */}
                                <div className="space-y-6">
                                    <div className="grid lg:grid-cols-1 gap-12">
                                        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img
                                                src={course.image_url || "https://via.placeholder.com/800x400?text=No+Image"}
                                                alt={course.course_name}
                                                className="w-full h-[350px] object-cover object-center"
                                            />
                                            <div className="p-5 flex flex-col gap-4">
                                                {/* Basic Info */}
                                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                                                    {course.course_name}
                                                </h2>

                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                                        Duration:
                                                    </span>{" "}
                                                    {course.course_duration} Days
                                                </p>

                                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                                        Overview:
                                                    </span>{" "}
                                                    {course.card_overview}
                                                </p>

                                                {/* Plan Section */}
                                                <div className="mt-6 border-t pt-4">
                                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                                                        Pricing Plan
                                                    </h3>
                                                    <p className="text-gray-700 dark:text-gray-300">
                                                        <span className="font-medium">Price:</span> ₹{course.price}
                                                    </p>

                                                    {/* List all non-null points dynamically */}
                                                    <ul className="list-disc pl-6 mt-3 space-y-1 text-gray-600 dark:text-gray-400">
                                                        {Array.from({ length: 7 }, (_, i) => (course as any)[`point_${i + 1}`])

                                                            .filter(Boolean)
                                                            .map((point, index) => (
                                                                <li key={index}>{point}</li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                    </>
                )}
            </div>
        </>
    );
}

interface FileUploadBoxProps {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    existingFileUrl?: string | null;
    clearExistingFile?: () => void;
}

function FileUploadBox({ selectedFile, setSelectedFile, existingFileUrl, clearExistingFile }: FileUploadBoxProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            if (clearExistingFile) clearExistingFile(); // remove old url
        }
    }, [setSelectedFile, clearExistingFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"], "image/webp": [".webp"] },
    });

    const handleDelete = () => {
        setSelectedFile(null);
        if (clearExistingFile) clearExistingFile();
    };

    // ✅ show new file preview
    if (selectedFile) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
        return (
            <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
                <div className="flex items-center gap-4">
                    <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-20 w-20 object-cover rounded" />
                    <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    // ✅ show old image preview if exists
    if (existingFileUrl) {
        return (
            <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
                <div className="flex items-center gap-4">
                    <img src={existingFileUrl} alt="Old Preview" className="h-20 w-20 object-cover rounded" />
                    <div>
                        <p className="text-sm font-medium">Existing Image</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    // Default upload UI
    return (
        <div {...getRootProps()} className="transition border border-dashed rounded-xl h-[200px] flex items-center justify-center">
            <input {...getInputProps()} />
            <div className="max-w-[400px] text-center">
                <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                    <span className="font-medium underline text-theme-sm text-brand-500">
                        Browse File
                    </span>
                </h4>
                <span className="block text-sm text-gray-700 dark:text-gray-400">
                    Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                </span>
            </div>
        </div>
    );
}
