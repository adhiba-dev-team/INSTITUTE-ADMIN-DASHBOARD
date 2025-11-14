import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../icons/Upload icon.png";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import DatePicker from "../form/date-picker.tsx";
import PageMeta from "../common/PageMeta.tsx";
import PageBreadcrumb from "../common/PageBreadCrumb.tsx";

type FormDataType = {
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    expertise: string;
    experience_years: string;
    joining_date: string;
};

export default function AddNewTutor() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courses, setCourses] = useState<string[]>([]);


    const [formData, setFormData] = useState<FormDataType>({
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        expertise: "",
        experience_years: "",
        joining_date: "",
    });

    const [documents, setDocuments] = useState<{ tutor_image: File | null }>({
        tutor_image: null,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof FormDataType | "tutor_image", string>>
    >({});

    function validate() {
        const newErrors: typeof errors = {};

        if (!formData.first_name) newErrors.first_name = "First name is required";
        if (!formData.last_name) newErrors.last_name = "Last name is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.joining_date) newErrors.joining_date = "Joining date is required";

        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Invalid email";

        if (!formData.phone) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Phone must be 10 digits";

        if (!formData.expertise) newErrors.expertise = "Expertise is required";

        if (!formData.experience_years)
            newErrors.experience_years = "Experience is required";

        if (!documents.tutor_image)
            newErrors.tutor_image = "Profile photo upload is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) {
            toast.error("Please fix errors before submitting.");
            return;
        }

        try {
            setIsSubmitting(true);

            const data = new FormData();
            data.append("first_name", formData.first_name.trim());
            data.append("last_name", formData.last_name.trim());
            data.append("dob", formData.dob.trim());
            data.append("gender", formData.gender.trim());
            data.append("email", formData.email.trim());
            data.append("phone", formData.phone.trim());
            data.append("joining_date", formData.joining_date.trim());
            data.append("expertise", formData.expertise.trim());
            data.append("experience_years", formData.experience_years.trim());
            if (documents.tutor_image) {
                data.append("tutor_image", documents.tutor_image);
            }

            const res = await fetch(
                "https://nystai-backend.onrender.com/NystaiTutors/addtutor",
                {
                    method: "POST",
                    body: data,
                }
            );

            const responseData = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("Backend error response:", responseData);

                // ✅ Handle backend "fields" errors
                if (responseData.fields) {
                    Object.entries(responseData.fields).forEach(([field, info]: any) => {
                        if (info?.success === false && info?.msg) {
                            toast.error(`${field}: ${info.msg}`);
                        }
                    });
                } else if (responseData.errors && Array.isArray(responseData.errors)) {
                    responseData.errors.forEach((err: any) => {
                        toast.error(err.msg || JSON.stringify(err));
                    });
                } else {
                    toast.error(
                        responseData.message || "Failed to add tutor. Please try again."
                    );
                }
                return;
            }


            toast.success("Tutor added successfully!");

            // reset form
            setFormData({
                first_name: "",
                last_name: "",
                dob: "",
                gender: "",
                email: "",
                phone: "",
                expertise: "",
                experience_years: "",
                joining_date: "",
            });
            setDocuments({ tutor_image: null });
            setErrors({});
        } catch (error: any) {
            console.error("Network or unexpected error:", error);
            toast.error(error.message || "Something went wrong while adding tutor.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function formatDateToLocalISO(date: Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(
                    "https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans"
                );
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    // extract course_name only
                    setCourses(data.data.map((course: any) => course.course_name));
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <>
            <PageMeta
                title="Nystai Institute | CCTV & Home Automation Course Training"
                description="Join Nystai Institute to master CCTV installation and home automation systems."
            />
            <PageBreadcrumb
                pageTitle="All Trainers"
                pageTitleLink="/Trainers"
                pageTitle1="Add New Tutor"
            />

            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                            Add New Tutor
                        </h2>
                        {/* Form Grid 1 */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                            <div className="space-y-6">
                                <Label>First Name</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="John"
                                        type="text"
                                        className={`${errors.first_name
                                            ? "border border-red-500"
                                            : ""
                                            }`}
                                        value={formData.first_name}
                                        onChange={(e) => {
                                            const onlyLetters =
                                                e.target.value.replace(
                                                    /[^A-Za-z]/g,
                                                    ""
                                                );
                                            setFormData((prev) => ({
                                                ...prev,
                                                first_name: onlyLetters,
                                            }));
                                        }}
                                    />
                                    {errors.first_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Label>Last Name</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Doe"
                                        type="text"
                                        className={`${errors.last_name
                                            ? "border border-red-500"
                                            : ""
                                            }`}
                                        value={formData.last_name}
                                        onChange={(e) => {
                                            const onlyLetters =
                                                e.target.value.replace(
                                                    /[^A-Za-z]/g,
                                                    ""
                                                );
                                            setFormData((prev) => ({
                                                ...prev,
                                                last_name: onlyLetters,
                                            }));
                                        }}
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Label>Date of Birth</Label>
                                <DatePicker
                                    id="dob"
                                    placeholder="Select date of birth"
                                    maxDate={
                                        new Date(
                                            new Date().setFullYear(
                                                new Date().getFullYear() - 21
                                            )
                                        )
                                    }
                                    value={
                                        formData.dob
                                            ? new Date(formData.dob)
                                            : undefined
                                    }
                                    onChange={(date) => {
                                        const selectedDate = Array.isArray(date)
                                            ? date[0]
                                            : date;
                                        setFormData((prev) => ({
                                            ...prev,
                                            dob: selectedDate
                                                ? formatDateToLocalISO(
                                                    selectedDate
                                                )
                                                : "",
                                        }));
                                    }}
                                />
                                {errors.dob && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.dob}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Label>Gender</Label>
                                <CustomDropdown
                                    options={["Male", "Female", "Other"]}
                                    value={formData.gender}
                                    onSelect={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            gender: value,
                                        }))
                                    }
                                />
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Grid 2 */}
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                            <div className="space-y-6">
                                <Label>Mail ID</Label>
                                <Input
                                    placeholder="info@gmail.com"
                                    type="email"
                                    className={`${errors.email
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Label>Phone Number</Label>
                                <Input
                                    placeholder="9876543210"
                                    type="tel"
                                    className={`${errors.phone
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
                                        }))
                                    }
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Label>Expertise / Courses</Label>
                                <CustomDropdown
                                    options={courses} // ✅ now from API
                                    value={formData.expertise}
                                    onSelect={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            expertise: value,
                                        }))
                                    }
                                />
                                {errors.expertise && (
                                    <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Label>Years of Experience</Label>
                                <Input
                                    placeholder="7 Years"
                                    type="text"
                                    className={`${errors.experience_years
                                        ? "border border-red-500"
                                        : ""
                                        }`}
                                    value={formData.experience_years}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience_years: e.target.value,
                                        }))
                                    }
                                />
                                {errors.experience_years && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.experience_years}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Label>Joining Date</Label>
                                <DatePicker
                                    id="joining_date"
                                    placeholder="Select joining date"
                                    minDate={new Date()}
                                    value={
                                        formData.joining_date
                                            ? new Date(formData.joining_date)
                                            : undefined
                                    }
                                    onChange={(date) => {
                                        const selectedDate = Array.isArray(date)
                                            ? date[0]
                                            : date;
                                        setFormData((prev) => ({
                                            ...prev,
                                            joining_date: selectedDate
                                                ? formatDateToLocalISO(
                                                    selectedDate
                                                )
                                                : "",
                                        }));
                                    }}
                                />
                                {errors.joining_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.joining_date}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Upload Section */}
                        <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
                            Upload Profile photo
                        </h3>
                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <div className="space-y-6">
                                <Label>Pan Card</Label>
                                <FileUploadBox
                                    onFileSelect={(file) =>
                                        setDocuments((prev) => ({
                                            ...prev,
                                            tutor_image: file,
                                        }))
                                    }
                                />
                                {errors.tutor_image && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.tutor_image}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="grid xl:grid-cols-2 gap-6">
                            <div className="col-span-full flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm  disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? "Adding..." : "ADD TUTOR"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

type CustomDropdownProps<T extends string> = {
    label?: string;
    options: T[];
    value: T;
    onSelect?: (value: T) => void;
};

function CustomDropdown<T extends string>({
    label = "Pick an option",
    options = [],
    value,
    onSelect,
}: CustomDropdownProps<T>) {
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

    const handleSelect = (value: T) => {
        setIsOpen(false);
        onSelect?.(value);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-400
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
                {value || label}
            </button>

            <span
                className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    }`}
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </span>

            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function FileUploadBox({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect(null);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "image/*": [] },
    });
    return (
        <div
            {...getRootProps()}
            className="cursor-pointer rounded-md border border-dashed border-gray-300 p-8 text-center hover:border-gray-400"
        >
            <input {...getInputProps()} />
            {!selectedFile ? (
                <>
                    <img src={Upload} alt="Upload" className="mx-auto w-16" />
                    <p className="text-sm">
                        {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
                        <span className="font-medium underline text-brand-500">Browse File</span>
                    </p>
                    <span className="text-sm text-gray-700">Supported: JPEG, PNG, GIF, PDF, MP4, etc.</span>
                </>
            ) : (
                <div className="flex items-center justify-between">
                    <p>{selectedFile.name}</p>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}




