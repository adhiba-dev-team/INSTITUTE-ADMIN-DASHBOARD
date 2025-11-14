
import Label from "../Label";
import Input from "../input/InputField";
import DatePicker from "../date-picker.tsx";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

interface StudentFormData {
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
  course_price?: string;
  batch: string;
  tutor: string;
  tutor_id?: number | null;
  pan_card_url: string;
  aadhar_card_url: string;
  sslc_marksheet_url: string;
  passport_photo_url: string;
  pan_card?: File | null;
  aadhar_card?: File | null;
  sslc_marksheet?: File | null;
  passport_photo?: File | null;
}

const EditStudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    alt_phone: "",
    aadhar_number: "",
    pan_number: "",
    address: "",
    pincode: "",
    state: "",
    department: "",
    course: "",
    year_of_passed: "",
    experience: "",
    department_stream: "",
    course_duration: "",
    join_date: "",
    end_date: "",
    course_enrolled: "",
    course_price: "",
    batch: "",
    tutor: "",
    tutor_id: null,
    pan_card_url: "",
    aadhar_card_url: "",
    sslc_marksheet_url: "",
    passport_photo_url: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`https://nystai-backend.onrender.com/single-student/${id}`);
        const student = res.data.data;

        setFormData({
          ...formData,
          name: student.name ?? "",
          last_name: student.last_name ?? "",
          dob: student.dob ?? "",
          gender: student.gender ?? "",
          email: student.email ?? "",
          phone: student.phone ?? "",
          alt_phone: student.alt_phone ?? "",
          aadhar_number: student.aadhar_number ?? "",
          pan_number: student.pan_number ?? "",
          address: student.address ?? "",
          pincode: student.pincode ?? "",
          state: student.state ?? "",
          department: student.department ?? "",
          course: student.course ?? "",
          year_of_passed: student.year_of_passed ?? "",
          experience: student.experience ?? "",
          department_stream: student.department_stream ?? "",
          course_duration: student.course_duration ?? "",
          join_date: student.join_date ?? "",
          end_date: student.end_date ?? "",
          course_enrolled: student.course_enrolled ?? "",
          course_price: student.course_price ?? "",
          batch: student.batch ?? "",
          tutor: student.tutor ?? "",
          pan_card_url: student.pan_card_url ?? "",
          aadhar_card_url: student.aadhar_card_url ?? "",
          sslc_marksheet_url: student.sslc_marksheet_url ?? "",
          passport_photo_url: student.passport_photo_url ?? ""
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ✅ Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "First name is required";
    else if (!/^[A-Za-z]{4,30}$/.test(formData.name)) newErrors.name = "Name must be 4–30 letters only";

    if (!formData.last_name) newErrors.last_name = "Last name is required";
    else if (formData.last_name.length > 30) newErrors.last_name = "Last name must be at most 30 characters";
    else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) newErrors.last_name = "Last name must contain only letters";

    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 21) newErrors.dob = "Student must be at least 21 years old";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@(gmail\.com|yahoo\.com|outlook\.com|[\w-]+\.org)$/.test(formData.email))
      newErrors.email = "Invalid or unsupported email domain";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";

    if (!formData.alt_phone) newErrors.alt_phone = "Alternate phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.alt_phone)) newErrors.alt_phone = "Invalid alternate phone number";

    if (!/^\d{12}$/.test(formData.aadhar_number)) newErrors.aadhar_number = "Aadhar must be 12 digits";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_number)) newErrors.pan_number = "Invalid PAN number format";

    if (!formData.address) newErrors.address = "Address is required";
    else if (formData.address.length < 10 || formData.address.length > 100) newErrors.address = "Address must be between 10 and 100 characters";

    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";

    if (!formData.state) newErrors.state = "State is required";
    else if (formData.state.length < 2 || formData.state.length > 30) newErrors.state = "State must be between 2 and 30 characters";

    if (!formData.department) newErrors.department = "Department is required";
    else if (formData.department.length < 2 || formData.department.length > 50) newErrors.department = "Department must be 2–50 characters";

    if (!formData.course) newErrors.course = "Course is required";
    else if (formData.course.length < 2 || formData.course.length > 50) newErrors.course = "Course must be 2–50 characters";

    if (!/^(19|20)\d{2}$/.test(formData.year_of_passed)) newErrors.year_of_passed = "Enter a valid year (e.g. 2022)";

    if (!formData.experience) newErrors.experience = "Experience is required";
    else if (formData.experience.length > 20) newErrors.experience = "Experience must be at most 20 characters";

    if (!formData.department_stream.trim()) newErrors.department_stream = "Department / Stream is required";
    else if (!/^[A-Za-z]+$/.test(formData.department_stream)) newErrors.department_stream = "Only letters allowed";
    else if (formData.department_stream.length > 20) newErrors.department_stream = "Must be at most 20 characters";

    if (!formData.course_duration.trim()) newErrors.course_duration = "Course Duration is required";
    else if (!/^\d+$/.test(formData.course_duration)) newErrors.course_duration = "Only numbers are allowed";
    else if (formData.course_duration.length > 20) newErrors.course_duration = "Must be at most 20 digits";

    if (!formData.join_date) newErrors.join_date = "Join date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.tutor) newErrors.tutor = "Tutor is required";

    // File uploads
    if (!formData.passport_photo && !formData.passport_photo_url) newErrors.passport_photo = "Passport photo is required";
    if (!formData.pan_card && !formData.pan_card_url) newErrors.pan_card = "PAN card is required";
    if (!formData.aadhar_card && !formData.aadhar_card_url) newErrors.aadhar_card = "Aadhar card is required";
    if (!formData.sslc_marksheet && !formData.sslc_marksheet_url) newErrors.sslc_marksheet = "SSLC marksheet is required";

    setErrors(newErrors); // ✅ now this works
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && typeof value !== "object") {
          payload.append(key, value as string);
        }
      });

      if (formData.pan_card) payload.append("pan_card", formData.pan_card);
      if (formData.aadhar_card) payload.append("aadhar_card", formData.aadhar_card);
      if (formData.sslc_marksheet) payload.append("sslc_marksheet", formData.sslc_marksheet);
      if (formData.passport_photo) payload.append("passport_photo", formData.passport_photo);

      await axios.put(`https://nystai-backend.onrender.com/update-student/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Student updated!");
    } catch (error) {
      toast.error("Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses and tutors (remains same)
  const [availableCourses, setAvailableCourses] = useState<{ id: number; course_name: string }[]>([]);
  const [availableTutors, setAvailableTutors] = useState<{ tutor_id: number; full_name: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans");
        const result = await response.json();
        if (result.success) setAvailableCourses(result.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch("https://nystai-backend.onrender.com/NystaiTutors/getalltutors");
        const result = await response.json();
        if (result.success) {
          const tutors = result.tutors.map((t: any) => ({
            tutor_id: t.tutor_id,
            full_name: `${t.first_name} ${t.last_name || ""}`.trim()
          }));
          setAvailableTutors(tutors);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTutors();
  }, []);

  return (
    <>
      <PageMeta
        title="Nystai Institute | CCTV & Home Automation Course Training"
        description="Join Nystai Institute to master CCTV installation and home automation systems. Get hands-on training, expert guidance, and industry-ready skills for a successful tech career."
      />
      <PageBreadcrumb
        pageTitle="Student Course Details"
        pageTitleLink="/studentlist"
        pageTitle1="Edit Student Form"
      />

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6" >
          <div className="space-y-6" >

            <h2
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
              x-text="pageName"
            >
              Edit Student Form
            </h2>

            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Personal Details
            </h3>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>First Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="John"
                      type="text"
                      value={formData.name}
                      maxLength={20} // restrict to 50 characters
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Last Name</Label>
                  <div className="relative">
                    <Input placeholder="Doe" type="text" className=""
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <DatePicker
                    id="dob"
                    label="Date Of Birth"
                    placeholder="Select date of birth"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
                    value={
                      formData.dob && !isNaN(Date.parse(formData.dob))
                        ? new Date(formData.dob)
                        : undefined
                    }
                    onChange={(date) => {
                      const selectedDate = Array.isArray(date) ? date[0] : date;

                      if (selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");

                        setFormData({
                          ...formData,
                          dob: `${year}-${month}-${day}`, // ✅ Exact date, no UTC shift
                        });
                      } else {
                        setFormData({
                          ...formData,
                          dob: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>
                    Gender
                  </Label>
                  <div className="relative">
                    <CustomDropdown
                      options={["Male", "Female", "Other"]}
                      selected={formData.gender as "Male" | "Female" | "Other"}
                      onSelect={(value) => setFormData({ ...formData, gender: value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Mail ID</Label>
                  <div className="relative">
                    <Input placeholder="info@gmail.com" type="email" className=""
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Input placeholder="9876543210" type="tel" className=""
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Alternate Phone</Label>
                  <div className="relative">
                    <Input placeholder="9876543211" type="tel" className=""
                      value={formData.alt_phone}
                      onChange={(e) => setFormData({ ...formData, alt_phone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Aadhar Number</Label>
                  <div className="relative">
                    <Input placeholder="XXXX-XXXX-XXXX" type="text" className=""
                      value={formData.aadhar_number}
                      onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>PAN Number</Label>
                  <div className="relative">
                    <Input placeholder="ABCDE1234F" type="text" className=""
                      value={formData.pan_number}
                      onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Address</Label>
                  <div className="relative">
                    <Input
                      placeholder="123 Street, City"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      minLength={5}
                      maxLength={50}
                    />

                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Pincode</Label>
                  <div className="relative">
                    <Input placeholder="600001" type="text" className=""
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>State</Label>
                  <div className="relative">
                    <Input
                      placeholder="Tamil Nadu"
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      minLength={3}
                      maxLength={30}
                    />

                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              {/* Department */}
              <div className="space-y-6">
                <div>
                  <Label>Department</Label>
                  <div className="relative">
                    <Input
                      placeholder="Department Name"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      minLength={2}
                      maxLength={30}
                    />

                  </div>
                </div>
              </div>

              {/* Course */}
              <div className="space-y-6">
                <div>
                  <Label>Course</Label>
                  <div className="relative">
                    <Input
                      placeholder="Course Name"
                      type="text"
                      value={formData.course}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) { // limit to 30 characters
                          setFormData({ ...formData, course: value });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Year Of Passed */}
              <div className="space-y-6">
                <div>
                  <Label>Year Of Passed</Label>
                  <div className="relative">
                    <Input placeholder="e.g. 2022" type="text" className=""
                      value={formData.year_of_passed}
                      onChange={(e) => setFormData({ ...formData, year_of_passed: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-6">
                <div>
                  <Label>Experience</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 2 years"
                      type="text"
                      value={formData.experience}
                      maxLength={10} // restrict to 10 characters
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Academic & Course Details
            </h3>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Department / Stream</Label>
                  <div className="relative">
                    <Input
                      placeholder="John"
                      type="text"
                      value={formData.department_stream}
                      onChange={(e) =>
                        setFormData({ ...formData, department_stream: e.target.value })
                      }
                      minLength={2}
                      maxLength={30}
                      pattern="^[A-Za-z ]+$" // only alphabets & spaces
                      title="Department/Stream should only contain letters and spaces"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Course Duration</Label>
                  <div className="relative">
                    <Input
                      placeholder="6 Months"
                      type="text"
                      value={formData.course_duration}
                      onChange={(e) =>
                        setFormData({ ...formData, course_duration: e.target.value })
                      }
                      minLength={1}
                      maxLength={10}
                      pattern="^[0-9]+ ?[A-Za-z]+$" // e.g., "6 Months", "3 Years"
                      title="Course Duration should be like '6 Months' or '3 Years'"
                    />
                  </div>
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <div className="space-y-6">
                    <div>
                      <DatePicker
                        id="join-date"
                        label="Join Date"
                        placeholder="Select a date"
                        maxDate={new Date()}   // ✅ today is the latest selectable date
                        value={
                          formData.join_date && !isNaN(Date.parse(formData.join_date))
                            ? new Date(formData.join_date)
                            : undefined
                        }
                        onChange={(date) => {
                          const selectedDate = Array.isArray(date) ? date[0] : date;

                          if (selectedDate) {
                            const year = selectedDate.getFullYear();
                            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                            const day = String(selectedDate.getDate()).padStart(2, "0");

                            setFormData({
                              ...formData,
                              join_date: `${year}-${month}-${day}`,
                            });
                          } else {
                            setFormData({
                              ...formData,
                              join_date: "",
                            });
                          }
                        }}
                      />

                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <DatePicker
                    id="end-date"
                    label="End Date"
                    placeholder="Select a date"
                    value={
                      formData.end_date && !isNaN(Date.parse(formData.end_date))
                        ? new Date(formData.end_date)
                        : undefined
                    }
                    onChange={(date) => {
                      const selectedDate = Array.isArray(date) ? date[0] : date;

                      if (selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");

                        setFormData({
                          ...formData,
                          end_date: `${year}-${month}-${day}`,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          end_date: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              {/* Course Enrolled */}
              <div className="space-y-6">
                <div>
                  <Label>Course Enrolled</Label>
                  <div className="relative">
                    <CustomDropdown
                      options={availableCourses.map((course) => course.course_name)}
                      selected={formData.course_enrolled}   // ✅ use selected, not value
                      onSelect={(value) =>
                        setFormData({ ...formData, course_enrolled: value })
                      }
                    />

                  </div>
                </div>
              </div>

              {/* Course Price (Read Only) */}
              <div className="space-y-6">
                <div>
                  <Label>Course Price</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.course_price || ""}
                      readOnly
                      className="bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>


              {/* Batch */}
              <div className="space-y-6">
                <div>
                  <Label>Batch</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 2022-2023"
                      type="text"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      minLength={4}
                      maxLength={1}
                    />
                  </div>
                </div>
              </div>

              {/* Tutor */}
              <div className="space-y-6">
                <div>
                  <Label>Tutor</Label>
                  <div className="relative">
                    <CustomDropdown
                      options={availableTutors.map((tutor) => tutor.full_name)} // show all tutors
                      selected={formData.tutor} // 👈 pre-select old tutor
                      onSelect={(value) => {
                        const selectedTutor = availableTutors.find((t) => t.full_name === value);
                        setFormData({
                          ...formData,
                          tutor: selectedTutor ? selectedTutor.full_name : "",
                          tutor_id: selectedTutor ? selectedTutor.tutor_id : null, // keep id if needed
                        });
                      }}
                    />
                  </div>

                </div>
              </div>
            </div>
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Upload Documents
            </h3>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label>Pan Card</Label>
                <FileUploadBox
                  defaultFile={formData.pan_card_url}
                  onFileChange={(file) =>
                    setFormData((prev) => ({ ...prev, pan_card: file }))
                  }
                />
              </div>
              <div className="space-y-6">
                <Label>Aadhar Card</Label>
                <FileUploadBox
                  defaultFile={formData.aadhar_card_url}
                  onFileChange={(file) =>
                    setFormData((prev) => ({ ...prev, aadhar_card: file }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label>SSLC Marksheet</Label>
                <FileUploadBox
                  defaultFile={formData.sslc_marksheet_url}
                  onFileChange={(file) =>
                    setFormData((prev) => ({ ...prev, sslc_marksheet: file }))
                  }
                />
              </div>
              <div className="space-y-6">
                <Label>Passport Size Photo</Label>
                <FileUploadBox
                  defaultFile={formData.passport_photo_url}
                  onFileChange={(file) =>
                    setFormData((prev) => ({ ...prev, passport_photo: file }))
                  }
                />
              </div>
            </div>

            <div className="grid xl:grid-cols-2 gap-6">
              <div className="col-span-full flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Updating..." : "UPDATE STUDENT"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditStudentForm;

type CustomDropdownProps<T extends string> = {
  label?: string;
  options: T[];
  onSelect?: (value: T) => void;
  selected?: T;
};

function CustomDropdown<T extends string>({
  label = "Select",
  options = [],
  onSelect,
  selected,
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
        className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-700 
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {selected || label}
      </button>

      {/* Dropdown Icon */}
      <span
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </span>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useCallback } from "react";
import { Trash2 } from "lucide-react";
import PageMeta from "../../common/PageMeta.tsx";
import PageBreadcrumb from "../../common/PageBreadCrumb.tsx";

type FileUploadBoxProps = {
  defaultFile?: string; // for edit mode (URL or file name)
  onFileChange?: (file: File | null) => void;
};

function FileUploadBox({ defaultFile, onFileChange }: FileUploadBoxProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (defaultFile) {
      setPreviewUrl(defaultFile);
    }
  }, [defaultFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onFileChange?.(file); // ✅ send file to parent
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileChange?.(null);
  };

  const fileName = selectedFile?.name || (defaultFile ? defaultFile.split("/").pop() : "");
  const fileSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : null;

  if (previewUrl) {
    return (
      <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
        <div className="flex items-center gap-4">
          <div>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-12 w-12 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-gray-500">
              {fileSizeMB ? `${fileSizeMB} MB` : "Uploaded"}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[176px]">
      <form
        {...getRootProps()}
        className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
        id="demo-upload"
      >
        <input {...getInputProps()} />
        <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
          <div className="flex justify-center items-center shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
            </div>
          </div>
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
      </form>
    </div>
  );
}


