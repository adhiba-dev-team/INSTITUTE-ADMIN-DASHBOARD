import { Grid, List, PlusCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageBreadcrumb from "../common/PageBreadCrumb";
import PageMeta from "../common/PageMeta";
import axios from "axios";

type Student = {
    student_id: string | number;
    name: string;
    last_name: string;
    passport_photo_url: string;
    phone?: string;
    email?: string;
};

export default function ContactGrid() {

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

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
                <div className="mb-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:mb-7">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Contact</h3>
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

                <section className="bg-white p-6 py-8 px-4">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {students.map((student) => (
                                <div
                                    key={student.student_id}
                                    className="group rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-sm"
                                >
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={student.passport_photo_url}
                                            alt={`${student.name} ${student.last_name}`}
                                            className="w-full h-[213px] aspect-[3/4] object-cover object-center transform group-hover:scale-105 transition duration-300 ease-in-out"
                                        />
                                    </div>
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-5">
                                            {student.name} {student.last_name}
                                        </h3>
                                        <p className="text-gray-600 mb-2">{student.phone}</p>
                                        <p className="text-gray-600 font-medium">{student.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

