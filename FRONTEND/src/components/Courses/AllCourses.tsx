// ✅ AllCourses.tsx
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { ArrowLeft, PlusIcon, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import Upload from "../../../src/icons/Upload icon.png";
import Uploadafter from "../../../src/icons/OIP.webp";
import { toast } from "react-hot-toast";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";

// Define types for Course with Pricing and Errors
interface Course {
    _id: string;
    course_id?: string; // ✅ optional in case backend doesn’t send this
    course_name: string;
    course_duration: string;
    card_overview: string;
    image_url?: string;
    price?: number;
    point_1?: string;
    point_2?: string;
    point_3?: string;
    point_4?: string;
    point_5?: string;
}

interface FormErrors {
    courseName?: string;
    duration?: string;
    overview?: string;
    image?: string;
    price?: string;
    point_1?: string;
    point_2?: string;
    point_3?: string;
    point_4?: string;
    point_5?: string;
}

export default function AllCourses() {
    const [loading, setLoading] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const [courseName, setCourseName] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [overview, setOverview] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [price, setPrice] = useState<string>("");
    const [point1, setPoint1] = useState<string>("");
    const [point2, setPoint2] = useState<string>("");
    const [point3, setPoint3] = useState<string>("");
    const [point4, setPoint4] = useState<string>("");
    const [point5, setPoint5] = useState<string>("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        console.log("=== VALIDATING FORM ===");
        const formErrors: FormErrors = {};

        // Course Name - Allow letters, numbers, and spaces
        console.log("Validating courseName:", courseName);
        if (!courseName.trim()) {
            formErrors.courseName = "Course name is required";
        } else if (courseName.trim().length < 3) {
            formErrors.courseName = "Course name must be at least 3 characters";
        }

        // Duration
        console.log("Validating duration:", duration);
        if (!duration.trim()) {
            formErrors.duration = "Course duration is required";
        } else if (!/^\d+$/.test(duration) || Number(duration) < 1 || Number(duration) > 365) {
            formErrors.duration = "Course duration must be a number between 1 and 365";
        }

        // Overview
        console.log("Validating overview:", overview.substring(0, 50) + "...");
        if (!overview.trim()) {
            formErrors.overview = "Course overview is required";
        } else if (overview.trim().length < 10) {
            formErrors.overview = "Overview must be at least 10 characters";
        }

        // Price Validation
        console.log("Validating price:", price);
        if (!price.trim()) {
            formErrors.price = "Price is required";
        } else if (!/^\d+$/.test(price) || Number(price) < 0) {
            formErrors.price = "Price must be a valid positive number";
        }

        // Point Validations (at least point_1 is required)
        console.log("Validating point1:", point1);
        if (!point1.trim()) {
            formErrors.point_1 = "At least one feature point is required";
        }

        // Image Validation
        console.log("Validating selectedFile:", selectedFile ? selectedFile.name : "No file");
        if (!selectedFile) {
            formErrors.image = "Please upload an image.";
        } else {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            console.log("File type:", selectedFile.type);
            console.log("File size:", (selectedFile.size / 1024 / 1024).toFixed(2), "MB");

            if (!allowedTypes.includes(selectedFile.type)) {
                formErrors.image = "Only JPG, PNG, or WebP images are allowed.";
            }
            if (selectedFile.size > 2 * 1024 * 1024) { // 2MB
                formErrors.image = "Image size must be less than 2MB.";
            }
        }

        console.log("Validation errors:", formErrors);
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    // ✅ Replace your existing handleSave and fetchCourses functions with this:
    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        const formData = new FormData();
        formData.append("course_name", courseName);
        formData.append("course_duration", duration);
        formData.append("card_overview", overview);
        formData.append("price", price);

        if (point1.trim()) formData.append("point_1", point1);
        if (point2.trim()) formData.append("point_2", point2);
        if (point3.trim()) formData.append("point_3", point3);
        if (point4.trim()) formData.append("point_4", point4);
        if (point5.trim()) formData.append("point_5", point5);

        if (selectedFile) {
            console.log("📤 Appending file:", selectedFile.name, selectedFile.size, selectedFile.type);
            formData.append("image_url", selectedFile); // ✅ FIXED
        }

        try {
            console.log("🚀 Sending POST to /Allcourses/add-course-with-plan");
            setLoading(true);
            const response = await fetch(
                "https://nystai-backend.onrender.com/Allcourses/add-course-with-plan",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();
            console.log("📥 Raw Response:", result);

            if (response.ok) {
                toast.success("Course added successfully!");
                closeModal();
                setCourseName("");
                setDuration("");
                setOverview("");
                setPrice("");
                setPoint1("");
                setPoint2("");
                setPoint3("");
                setPoint4("");
                setPoint5("");
                setSelectedFile(null);
                await fetchCourses();
            } else {
                console.error("❌ Backend rejected:", result);
                toast.error(result?.message || result?.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("❌ Error adding course:", error);
            toast.error("Failed to add course.");
        } finally {
            setLoading(false);
        }
    };


    // ✅ safer fetchCourses
    const fetchCourses = async () => {
        try {
            const response = await fetch(
                "https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans"
            );
            const data = await response.json();
            console.log("📦 GET /all-courses-with-plans result:", data);

            if (Array.isArray(data)) {
                setCourses(data);
            } else if (Array.isArray(data?.courses)) {
                setCourses(data.courses);
            } else if (Array.isArray(data?.data)) {
                setCourses(data.data);
            } else {
                console.warn("⚠ Unexpected data structure:", data);
                setCourses([]);
            }
        } catch (error) {
            console.error("❌ Failed to fetch courses:", error);
        }
    };


    useEffect(() => {
        console.log("Rendering courses:", courses);
    }, [courses]);


    useEffect(() => {
        fetch("https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans")
            .then(res => res.json())
            .then(data => {
                console.log("GET /get-all-courses response:", data);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetchCourses();
    }, []);

    function truncateText(text: string, wordLimit = 20): string {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    }

    return (
        <>
            <PageMeta title="All Courses - Nystai Institute" description="All available courses" />
            <PageBreadcrumb pageTitle="All Course" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">All Courses</h3>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                    >
                        <PlusIcon className="size-5 text-gray-800" />
                        Add Course
                    </button>
                </div>

                {/* Add Course Modal with Pricing */}
                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">Add Course & Pricing</h4>
                        <form className="flex flex-col mt-5" onSubmit={(e) => e.preventDefault()}>
                            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    {/* Course Name */}
                                    <div>
                                        <Label className="mb-3">Course Name *</Label>
                                        <Input
                                            type="text"
                                            placeholder="IoT Mastery"
                                            value={courseName}
                                            onChange={(e) => setCourseName(e.target.value)}
                                            minLength={3}
                                            maxLength={50}
                                        />
                                        {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
                                    </div>

                                    {/* Course Duration */}
                                    <div>
                                        <Label className="mb-3">Course Duration (Days) *</Label>
                                        <Input
                                            type="text"
                                            placeholder="3"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                                    </div>


                                    {/* Course Overview */}
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Course Overview *</Label>
                                        <textarea
                                            placeholder="Learn IoT from basics to advanced."
                                            className="w-full border rounded-2xl border-gray-300 px-3 py-2 h-[100px] resize-none text-sm text-gray-700"
                                            value={overview}
                                            onChange={(e) => setOverview(e.target.value)}
                                        />
                                        {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
                                    </div>

                                    {/* Price */}
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Price (₹) *</Label>
                                        <Input
                                            type="text"
                                            placeholder="4999"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                    </div>

                                    {/* Feature Points */}
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Feature Points</Label>
                                        <div className="space-y-3">
                                            <div>
                                                <Input
                                                    type="text"
                                                    placeholder="Point 1: Hands-on projects *"
                                                    value={point1}
                                                    onChange={(e) => setPoint1(e.target.value)}
                                                />
                                                {errors.point_1 && <p className="text-red-500 text-sm mt-1">{errors.point_1}</p>}
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="Point 2: Certificate included"
                                                value={point2}
                                                onChange={(e) => setPoint2(e.target.value)}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Point 3: Expert mentors"
                                                value={point3}
                                                onChange={(e) => setPoint3(e.target.value)}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Point 4: Lifetime access"
                                                value={point4}
                                                onChange={(e) => setPoint4(e.target.value)}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Point 5: Job assistance"
                                                value={point5}
                                                onChange={(e) => setPoint5(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Upload Image */}
                                    <div className="lg:col-span-2">
                                        <Label className="mb-3">Upload Image *</Label>
                                        <FileUploadBox selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                                <button onClick={closeModal} className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800">
                                    <ArrowLeft className="size-5 text-[#F8C723]" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={loading}
                                    className={`flex items-center gap-2 rounded-2xl border border-gray-300 px-20 py-2 text-sm font-medium shadow-theme-xs ${loading
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-[#F8C723] text-gray-700 hover:bg-gray-50 hover:text-gray-800"
                                        }`}
                                >
                                    {loading ? "Adding..." : "Add Course & Pricing"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <div className="space-y-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
                        {courses.length === 0 ? (
                            <>
                                {console.log("Courses is empty array:", courses)}
                                <p className="text-center col-span-full text-gray-500">No courses available.</p>
                            </>
                        ) : (
                            courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm flex flex-col h-full"
                                >
                                    <img
                                        src={course.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                                        alt={course.course_name}
                                        className="w-full h-48 object-cover object-center"
                                    />
                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <div>
                                            <a href="#" className="text-xs font-bold uppercase inline-block mb-3">
                                                {course.course_name}
                                            </a>
                                            <div className="mb-2">
                                                <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Duration:</span>{' '}
                                                <span className="text-sm text-gray-800 dark:text-gray-300">{course.course_duration} Days</span>
                                            </div>

                                            <div className="mb-4">
                                                <span className="text-ml font-semibold text-gray-700 dark:text-white/90">Overview:</span>{' '}
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{truncateText(course.card_overview, 20)}</span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/course/${course.course_id}`}
                                            className="flex justify-center items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-100 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-white/90"
                                        >
                                            Learn More
                                        </Link>

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

// ✅ Upload Component
function FileUploadBox({
    selectedFile,
    setSelectedFile
}: {
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSelectedFile(acceptedFiles[0]);
        }
    }, [setSelectedFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
    });

    const handleDelete = () => setSelectedFile(null);

    if (selectedFile) {
        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
        return (
            <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
                <div className="flex items-center gap-4">
                    <img src={Uploadafter} alt="Preview" className="h-12 w-12 object-contain" />
                    <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={`transition border border-gray-300 border-dashed cursor-pointer rounded-xl h-[200px] p-7 lg:p-10 ${isDragActive ? "bg-gray-100" : "bg-gray-50"}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col justify-center items-center text-center h-full gap-2">
                <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
                <p className="text-sm">
                    {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                    <span className="font-medium underline text-brand-500">Browse File</span>
                </p>
                <span className="text-sm text-gray-700">Supported: JPEG, PNG, GIF, PDF, MP4, etc.</span>
            </div>
        </div>
    );
}
