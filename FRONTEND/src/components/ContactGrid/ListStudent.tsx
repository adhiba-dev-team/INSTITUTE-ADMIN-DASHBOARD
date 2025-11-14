import { Grid, List, MoreVertical, PlusCircleIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Modal } from "../ui/modal";

interface Student {
    student_id: number;
    name: string;
    last_name: string;
    passport_photo_url: string;
    course_enrolled: string;
    phone: string;
    email: string;
}


export default function ListStudent() {

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteStudentId, setDeleteStudentId] = useState<number | null>(null);

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
            await axios.delete(`https://nystai-backend.onrender.com/students/${deleteStudentId}`);

            // Remove the deleted student from state
            setStudents((prev) => prev.filter((s) => s.student_id !== deleteStudentId));

            // Show success toast
            toast.success("Student deleted successfully");

            // Close the modal
            closeDeleteModal();

        } catch (err) {
            console.error("Error deleting student:", err);
            toast.error("Failed to delete student.");
            closeDeleteModal(); // Optional: also close modal on error
        }
    };


    useEffect(() => {
        axios
            .get("https://nystai-backend.onrender.com/get-all-students")
            .then((res) => {
                setStudents(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching students:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="p-4">Loading students...</p>;

    return (
        <>
            <PageMeta title="All Courses - Nystai Institute" description="All available courses" />
            <PageBreadcrumb pageTitle="Contact Grid" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">List Contact</h3>
                    <div className="flex flex-row gap-6">
                        <Link to="/ContactGrid"
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <Grid className="w-4 h-4" />
                            Grid
                        </Link>
                        <Link to="/ListStudent"
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <List className="w-4 h-4" />
                            List
                        </Link>
                        <Link to="/AddStudentForm"
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                        >
                            <PlusCircleIcon className="w-4 h-4" />
                            Add Contact
                        </Link>
                    </div>
                </div>





                <div className="relative overflow-visible rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-visible">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Student Name
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Course Name
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Phone Number
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        Mail Id
                                    </TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                        &nbsp;
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {students.map((student) => (
                                    <TableRow key={student.student_id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
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
                                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {student.name} {student.last_name}
                                                    </span>
                                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                        Student
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {student.course_enrolled}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {student.phone}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {student.email}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center justify-between">
                                                <ActionDropdown
                                                    onEdit={() => console.log("Edit", student.student_id)}
                                                    onDelete={() => openDeleteModal(student.student_id)} // Open modal here
                                                    studentId={student.student_id}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteOpen && (
                <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} className="max-w-md m-4">
                    <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 ">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-8">
                            Confirm Student Deletion
                        </h4>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-10 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                Yes, Delete Student
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded-2xl border border-[#F8C723] text-gray-800 dark:text-white/90"
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
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
            >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-[200px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-dark">
                    <ul className="flex flex-col gap-1">
                        <li>
                            <Link to={`/Editstudentform/${studentId}`}>
                                <button
                                    onClick={onEdit}
                                    className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                    Edit Detailss
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={onDelete}
                                className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                Delete Student
                            </button>
                        </li>
                        <li>
                            <Link
                                to={`/student/${studentId}`}
                                className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                Certificate Status
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/Student-PDF/${studentId}`}
                                className="flex w-full font-normal text-left px-3 py-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                                PDF View
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
