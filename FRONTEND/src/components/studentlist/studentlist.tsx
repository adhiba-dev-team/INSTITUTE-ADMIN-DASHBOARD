import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, X, PlusCircleIcon } from "lucide-react";
import Badge from "../ui/badge/Badge";
import axios from "axios";
import { Link } from "react-router";
import { Modal } from "../ui/modal";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

type Student = {
  student_id: number;
  name: string;
  last_name: string;
  course_enrolled: string;
  join_date: string;
  tutor: string;
  end_date: string;
  course_duration: string;
  passport_photo_url: string;
  certificate_status: "Issued" | "Pending" | "Completed";
};

function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
      >
        <span className="block mr-1 font-medium text-theme-sm">
          {selected || `All ${label}`}
        </span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-[17px] w-[220px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg z-50"
        >
          <ul className="flex flex-col gap-1">
            <li>
              <button
                onClick={() => {
                  onSelect(null);
                  closeDropdown();
                }}
                className="px-3 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-100 text-left"
              >
                All {label}
              </button>
            </li>
            {options.map((opt) => (
              <li key={opt}>
                <button
                  onClick={() => {
                    onSelect(opt);
                    closeDropdown();
                  }}
                  className="px-3 py-2 font-medium text-gray-700 rounded-lg hover:bg-gray-100 text-left"
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function BasicTableOne() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [courseList, setCourseList] = useState<string[]>([]);
  const [statusList, setStatusList] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get("https://nystai-backend.onrender.com/get-all-students")
      .then((res) => {
        const fetchedStudents: Student[] = res.data.data;
        setStudents(fetchedStudents);

        // Extract unique course list
        const uniqueCourses = Array.from(
          new Set(fetchedStudents.map((s) => s.course_enrolled))
        );
        setCourseList(uniqueCourses);

        // Extract unique statuses
        const uniqueStatuses = Array.from(
          new Set(fetchedStudents.map((s) => s.certificate_status))
        );
        setStatusList(uniqueStatuses);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((s) => {
    const courseMatch = selectedCourse
      ? s.course_enrolled === selectedCourse
      : true;
    const statusMatch = selectedStatus
      ? s.certificate_status === selectedStatus
      : true;
    return courseMatch && statusMatch;
  });

  const openDeleteModal = (id: number) => {
    setDeleteStudentId(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeleteStudentId(null);
  };

  const handleDelete = async () => {
    if (!deleteStudentId) return;

    try {
      await axios.delete(
        `https://nystai-backend.onrender.com/students/${deleteStudentId}`
      );
      setStudents((prev) =>
        prev.filter((s) => s.student_id !== deleteStudentId)
      );
      toast.success("Student deleted successfully");
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.error("Failed to delete student.");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6">
      <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800">
          Student Course Details
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/AddStudentForm"
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] w-fit px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add Student
          </Link>

          {/* Course filter */}
          <FilterDropdown
            label="Courses"
            options={courseList}
            selected={selectedCourse}
            onSelect={setSelectedCourse}
          />

          {/* Status filter */}
          <FilterDropdown
            label="Status"
            options={statusList}
            selected={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </div>
      </div>

      <div className="relative overflow-visible rounded-xl border border-gray-200 bg-white">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="border-b border-gray-100">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Student Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Course Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  From Date - To Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Duration
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Tutor
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  Certificate
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">
                  &nbsp;
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48">
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-sm">Loading students...</p>
                    </div>
                  </TableCell>

                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={student.passport_photo_url}
                            alt={`${student.name} ${student.last_name}`}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800">
                            {student.name} {student.last_name}
                          </span>
                          <span className="block text-gray-500 text-xs">Student</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">
                      {student.course_enrolled}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {new Date(student.join_date).toLocaleDateString()} -{" "}
                      {new Date(student.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {student.course_duration}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">
                      {student.tutor}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">
                      <Badge
                        size="sm"
                        color={
                          student.certificate_status === "Issued"
                            ? "success"
                            : student.certificate_status === "Pending"
                              ? "warning"
                              : "error"
                        }
                      >
                        {student.certificate_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <ActionDropdown
                          onEdit={() => console.log("Edit", student.student_id)}
                          onDelete={() => openDeleteModal(student.student_id)}
                          studentId={student.student_id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48">
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-sm">No students found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-md m-4">
          <div className="p-6 rounded-3xl bg-white">
            <h4 className="text-xl font-semibold text-gray-800 mb-8">
              Confirm Student Deletion
            </h4>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700"
              >
                Yes, Delete Student
              </button>
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800"
              >
                <X size={18} className="text-[#F8C723]" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ActionDropdown({
  onEdit,
  onDelete,
  studentId,
}: {
  onEdit: () => void;
  onDelete: () => void;
  studentId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate menu position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 6, // little space
        left: rect.right + window.scrollX - 200, // align right (width ~200px)
      });
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-[9999] w-[200px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <ul className="flex flex-col gap-1">
              <li>
                <Link to={`/Editstudentform/${studentId}`}>
                  <button
                    onClick={onEdit}
                    className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                  >
                    Edit Details
                  </button>
                </Link>
              </li>
              <li>
                <button
                  onClick={onDelete}
                  className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Delete Student
                </button>
              </li>
              <li>
                <Link
                  to={`/student/${studentId}`}
                  className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Certificate Status
                </Link>
              </li>
              <li>
                <Link
                  to={`/Student-PDF/${studentId}`}
                  className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  PDF View
                </Link>
              </li>
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}





