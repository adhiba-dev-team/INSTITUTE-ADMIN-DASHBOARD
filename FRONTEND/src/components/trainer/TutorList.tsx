import { Edit, PlusCircleIcon, Trash2, X, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import axios from "axios";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useDropzone } from "react-dropzone";
import Upload from "../../icons/Upload icon.png";
import { toast } from "react-hot-toast";
import DatePicker from "../form/date-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface Tutor {
  tutor_id: number;
  first_name?: string;
  last_name?: string;
  name: string;
  dob: string;
  role?: string; // alias for expertise in UI card
  gender: string;
  email: string;
  contact: string; // phone shown in cards
  expertise: string;
  experience_years: string;
  joining_date: string;
  img?: string;
}

type FormState = {
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

export default function TutorList() {
  return (
    <>
      <PageMeta title="All Courses - Nystai Institute" description="All available courses" />
      <PageBreadcrumb pageTitle="Tutor List" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tutor List</h3>
          <div className="flex flex-row gap-6">
            <Link
              to="/Createtask"
              className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create Task
            </Link>
            <Link
              to="/AddNewTutor"
              className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <PlusCircleIcon className="w-4 h-4" />
              Add Tutor
            </Link>
          </div>
        </div>

        <div className="space-y-6 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 p-6">
            <ProfileCards />
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileCards() {
  const [team, setTeam] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<FormState>({
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  // ---- Fetch tutors ----
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await axios.get("https://nystai-backend.onrender.com/NystaiTutors/getalltutors");

        if (Array.isArray(res.data.tutors)) {
          const formattedTutors: Tutor[] = res.data.tutors.map((t: any) => ({
            tutor_id: t.tutor_id,
            first_name: t.first_name ?? "",
            last_name: t.last_name ?? "",
            name: `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim(),
            role: t.expertise ?? "",
            email: t.email ?? "",
            contact: t.phone ?? "",
            expertise: t.expertise ?? "",
            img: t.tutor_image ?? "",
            dob: t.dob ?? "",
            gender: t.gender ?? "",
            joining_date: t.joining_date ?? "",
            experience_years: t.experience_years ?? "",
          }));
          setTeam(formattedTutors);
        } else if (res.data.tutor) {
          setTeam([
            {
              tutor_id: res.data.tutor.tutor_id,
              first_name: res.data.tutor.first_name ?? "",
              last_name: res.data.tutor.last_name ?? "",
              name: `${res.data.tutor.first_name ?? ""} ${res.data.tutor.last_name ?? ""}`.trim(),
              role: res.data.tutor.expertise ?? "",
              email: res.data.tutor.email ?? "",
              contact: res.data.tutor.phone ?? "",
              expertise: res.data.tutor.expertise ?? "",
              img: res.data.tutor.tutor_image ?? "",
              dob: res.data.tutor.dob ?? "",
              gender: res.data.tutor.gender ?? "",
              joining_date: res.data.tutor.joining_date ?? "",
              experience_years: res.data.tutor.experience_years ?? "",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
        toast.error("Failed to load tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  // ---- Delete ----
  const openDeleteModal = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsDeleteOpen(true);
  };

  const handleDeleteTutor = async () => {
    if (!selectedTutor) return;
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `https://nystai-backend.onrender.com/NystaiTutors/deletetutor/${selectedTutor.tutor_id}`
      );
      toast.success(res.data.message || "Tutor deleted successfully");
      setTeam((prev) => prev.filter((t) => t.tutor_id !== selectedTutor.tutor_id));
      setIsDeleteOpen(false);
      setSelectedTutor(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete tutor");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---- Edit ----
  const openEditModal = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    // Initialize form from selected tutor so dropdowns show the existing value
    setFormData({
      first_name: tutor.first_name || "",
      last_name: tutor.last_name || "",
      dob: tutor.dob || "",
      gender: tutor.gender || "",
      email: tutor.email || "",
      phone: tutor.contact || "",
      expertise: tutor.expertise || "",
      experience_years: tutor.experience_years || "",
      joining_date: tutor.joining_date || "",
    });
    setSelectedFile(null);
    setIsImageRemoved(false);
    setIsEditOpen(true);
  };

  const toYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // ---- Update ----
  const handleUpdateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTutor) return;

    setIsUpdating(true);

    const tutorId = Number(selectedTutor.tutor_id);
    const updateUrl = `https://nystai-backend.onrender.com/NystaiTutors/updatetutor/${tutorId}`;

    try {
      // Always use FormData to satisfy backend expectations for optional image
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) payload.append(key, String(value));
      });

      if (selectedFile) payload.append("tutor_image", selectedFile);
      if (isImageRemoved) payload.append("remove_image", "true");

      const res = await axios.put(updateUrl, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.message || "Tutor updated successfully");

      // Update local UI state
      setTeam((prev) =>
        prev.map((t) =>
          t.tutor_id === tutorId
            ? {
              ...t,
              first_name: formData.first_name,
              last_name: formData.last_name,
              name: `${formData.first_name} ${formData.last_name}`.trim(),
              email: formData.email,
              contact: formData.phone,
              expertise: formData.expertise,
              role: formData.expertise,
              dob: formData.dob,
              gender: formData.gender,
              joining_date: formData.joining_date,
              experience_years: formData.experience_years,
              img: selectedFile
                ? URL.createObjectURL(selectedFile) // instant UI feedback
                : isImageRemoved
                  ? ""
                  : t.img,
            }
            : t
        )
      );

      // Close modal and clean up
      setIsEditOpen(false);
      setTimeout(() => {
        setSelectedTutor(null);
        setSelectedFile(null);
        setIsImageRemoved(false);
      }, 150);
    } catch (error: any) {
      console.error("Update Tutor Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update tutor");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {team.map((person, i) => (
        <div
          key={person.tutor_id ?? i}
          className="relative w-72 h-72 group overflow-hidden rounded-lg shadow-lg bg-white border border-gray-300"
        >
          {/* Card Info */}
          <div className="absolute top-25 left-0 w-full p-4 bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
            <div className="grid grid-cols-[20%_10%_1fr] gap-2 mb-3">
              <span className="font-medium text-gray-500 dark:text-gray-400">Coaching</span>
              <span className="font-medium text-gray-500 dark:text-gray-400 text-center">:</span>
              <span className="break-words whitespace-normal text-gray-800 dark:text-white/90">
                {person.expertise}
              </span>
            </div>
            <div className="grid grid-cols-[20%_10%_1fr] gap-2 mb-3">
              <span className="font-medium text-gray-500 dark:text-gray-400">Contact</span>
              <span className="font-medium text-gray-500 dark:text-gray-400 text-center">:</span>
              <span className="break-words whitespace-normal text-gray-800 dark:text-white/90">
                {person.contact}
              </span>
            </div>
            <div className="grid grid-cols-[20%_10%_1fr] gap-2 mb-3">
              <span className="font-medium text-gray-500 dark:text-gray-400">Mail Id</span>
              <span className="font-medium text-gray-500 dark:text-gray-400 text-center">:</span>
              <span className="break-words whitespace-normal text-gray-800 dark:text-white/90">
                {person.email}
              </span>
            </div>
          </div>


          {/* Image */}
          <div className="absolute top-0 left-0 w-full h-full z-10 transform transition-transform duration-500 ease-in-out group-hover:-translate-y-50">
            <img src={person.img} alt={person.name} className="w-72 h-72 object-cover" />
          </div>

          {/* Icons */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 flex justify-between items-center w-[260px] gap-2">
            <div className="max-w-[160px] text-left opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <h2 className="text-lg font-medium text-white">{person.name}</h2>
              <p className="text-sm text-white leading-relaxed line-clamp-3">{person.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-transparent p-1 rounded-full hover:bg-[#F8C723] transition"
                onClick={() => openEditModal(person)}
              >
                <Edit className="text-white" size={18} />
              </button>

              <button
                className="bg-transparent p-1 rounded-full hover:bg-[#F8C723] transition"
                onClick={() => openDeleteModal(person)}
              >
                <Trash2 className="text-white" size={18} />
              </button>

            </div>
          </div>

          {/* Bottom Name & Role */}
          <div className="absolute bottom-0 left-0 w-full p-4 flex justify-center text-center transition-opacity duration-500 z-20 opacity-100 group-hover:opacity-0">
            <h2 className="text-xl font-medium text-white leading-6 tracking-wide">
              {person.name} <br />
              <span className="text-gray-300 text-sm font-light tracking-wider">{person.role}</span>
            </h2>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {isEditOpen && selectedTutor && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-[900px] m-4">
          <div className="w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-center">Edit Tutor</h4>

            <form className="flex flex-col mt-5" onSubmit={handleUpdateTutor}>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value.replace(/[^A-Za-z]/g, ""),
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value.replace(/[^A-Za-z]/g, ""),
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <DatePicker
                    id="dob"
                    placeholder="Select a date"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
                    value={formData.dob && !isNaN(Date.parse(formData.dob)) ? new Date(formData.dob) : undefined}
                    onChange={(date) => {
                      const d = Array.isArray(date) ? date[0] : date;
                      setFormData((prev) => ({ ...prev, dob: d ? toYMD(d) : "" }));
                    }}
                  />
                </div>

                <div>
                  <Label>Gender</Label>
                  <CustomDropdown
                    staticOptions={["Male", "Female", "Other"]}
                    value={formData.gender}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                  />

                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 mt-5">
                <div>
                  <Label>Mail ID</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Joining Date</Label>
                  <DatePicker
                    id="join-date"
                    placeholder="Select a date"
                    value={
                      formData.joining_date && !isNaN(Date.parse(formData.joining_date))
                        ? new Date(formData.joining_date)
                        : undefined
                    }
                    onChange={(date) => {
                      const d = Array.isArray(date) ? date[0] : date;
                      setFormData((prev) => ({ ...prev, joining_date: d ? toYMD(d) : "" }));
                    }}
                  />
                </div>

                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="text"
                    value={formData.experience_years}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mt-5 mb-5">
                <div>
                  <Label>Expertise / Courses</Label>
                  <CustomDropdown
                    label="Select Expertise"
                    value={formData.expertise}
                    onSelect={(value) => setFormData((prev) => ({ ...prev, expertise: value }))}
                    apiEndpoint="https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans"
                  />
                </div>
              </div>

              <div>
                <Label>Upload Profile Photo</Label>
                <FileUploadBox
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  previewImage={selectedTutor.img}
                  isImageRemoved={isImageRemoved}
                  setIsImageRemoved={setIsImageRemoved}
                />
              </div>

              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-center">
                <button
                  type="button"
                  className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800"
                  onClick={() => setIsEditOpen(false)}
                >
                  <ArrowLeft className="size-5 text-[#F8C723]" />
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
                >
                  {isUpdating ? "Updating..." : "Update Tutor"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteOpen && selectedTutor && (
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-md m-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-8">
              Confirm Tutor Deletion
            </h4>
            <div className="flex justify-center gap-4">
              <button
                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteTutor}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Tutor"}
              </button>

              <button
                className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800"
                onClick={() => setIsDeleteOpen(false)}
              >
                <X size={18} className="text-[#F8C723]" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function FileUploadBox({
  selectedFile,
  setSelectedFile,
  previewImage,
  isImageRemoved,
  setIsImageRemoved,
}: {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  previewImage?: string | null;
  isImageRemoved: boolean;
  setIsImageRemoved: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setIsImageRemoved(false);
      }
    },
    [setSelectedFile, setIsImageRemoved]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => {
    setSelectedFile(null);
    setIsImageRemoved(true);
  };

  const displayImage = !isImageRemoved && (selectedFile ? URL.createObjectURL(selectedFile) : previewImage);

  return displayImage ? (
    <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[200px]">
      <div className="flex items-center gap-4">
        <img src={displayImage} alt="Preview" className="h-12 w-12 object-contain" />
        <div>
          <p className="text-sm font-medium">{selectedFile?.name || "Current Image"}</p>
          {selectedFile && <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>}
        </div>
      </div>
      <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
        <Trash2 size={18} />
      </button>
    </div>
  ) : (
    <div
      {...getRootProps()}
      className={`transition border border-gray-300 border-dashed cursor-pointer rounded-xl h-[200px] p-7 lg:p-10 ${isDragActive ? "bg-gray-100" : "bg-gray-50"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col justify-center items-center text-center h-full gap-2">
        <img src={Upload || "https://via.placeholder.com/50"} alt="Upload Icon" className="h-12 w-12 object-contain" />
        <p className="text-sm">
          {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
          <span className="font-medium underline text-brand-500">Browse File</span>
        </p>
        <span className="text-sm text-gray-700">Supported: JPEG, PNG, GIF, PDF, MP4, etc.</span>
      </div>
    </div>
  );
}

type CustomDropdownProps<T extends string> = {
  label?: string;
  value: T;
  onSelect?: (value: T) => void;
  apiEndpoint?: string; // Optional API endpoint to fetch options
  staticOptions?: T[]; // Fallback static options if no API
};

function CustomDropdown<T extends string>({
  label = "Pick an option",
  value,
  onSelect,
  apiEndpoint,
  staticOptions = [],
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<T[]>(staticOptions);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!apiEndpoint) return;
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiEndpoint);
        // Assuming API returns an array of objects with course_name
        const apiOptions = response.data.data.map((c: any) => c.course_name);
        setOptions(apiOptions);
      } catch (err) {
        console.error("Failed to fetch dropdown options:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [apiEndpoint]);

  const handleSelect = (val: T) => {
    onSelect?.(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-600
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {loading ? "Loading..." : value || label}
      </button>

      <span
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </span>

      {isOpen && !loading && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSelect(option);
                }}
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
