import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowUp, GraduationCap, BookOpen, BookCheck, UserPlus } from "lucide-react";
import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedCount, setCompletedCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await axios.get("https://nystai-backend.onrender.com/students-count");
        if (res.data?.count !== undefined) setStudentCount(res.data.count);
      } catch (error) {
        console.error("Error fetching student count:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentCount();
  }, []);

  useEffect(() => {
    const fetchCompletedCount = async () => {
      try {
        const res = await axios.get("https://nystai-backend.onrender.com/get-completed-students-count");
        if (res.data?.success) setCompletedCount(res.data.count);
      } catch (error) {
        console.error("Error fetching completed students count:", error);
      }
    };
    fetchCompletedCount();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {/* Total Student */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GraduationCap className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Student</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "Loading..." : studentCount ?? "0"}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="w-4 h-4" />
            1.8%
          </Badge>
        </div>
      </div>

      {/* System Integration Program */}
      <CourseCard />

      {/* Course Completed */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BookCheck className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Course Completed</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {completedCount !== null ? completedCount.toLocaleString() : "Loading..."}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="w-4 h-4" />
            1.8%
          </Badge>
        </div>
      </div>

      {/* Add Student Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <Link to="/AddStudentForm">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <UserPlus className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Add Student Form</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function CourseCard() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`https://nystai-backend.onrender.com/count/${selectedCourse}`);
        setCount(res.data.data?.student_count || 0);
      } catch (error) {
        console.error("Error fetching course count:", error);
        setCount(0);
      }
    };
    fetchCount();
  }, [selectedCourse]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <BookOpen className="text-gray-800 size-6 dark:text-white/90" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400"> <UserDropdown selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} /></span>
      </div>

      <div className="flex items-end justify-between">
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{count}</h4>
        <Badge color="success">
          <ArrowUp className="w-4 h-4" />
          1.8%
        </Badge>
      </div>
    </div>
  );
}

interface UserDropdownProps {
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
}

function UserDropdown({ selectedCourse, setSelectedCourse }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans");
        // Extract the course_name field from the response
        const courseList = response.data.data.map((c: any) => c.course_name);
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-3 py-1 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        <span className="block mr-1 font-medium text-sm">
          {loading ? "Loading..." : selectedCourse || "Select Course"}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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

      {isOpen && !loading && (
        <ul className="absolute right-0 mt-[5px] w-[160px] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
          {courses.length > 0 ? (
            courses.map((course) => (
              <li
                key={course}
                onClick={() => {
                  setSelectedCourse(course);
                  setIsOpen(false);
                }}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-sm text-gray-700 dark:text-gray-400"
              >
                {course}
              </li>

            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No courses found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}


