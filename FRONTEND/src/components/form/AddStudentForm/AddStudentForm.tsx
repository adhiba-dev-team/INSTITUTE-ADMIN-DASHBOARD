import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import DatePicker from "../date-picker.tsx";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import Uploadafter from "../../../icons/OIP.webp";
import { toast } from 'react-hot-toast';

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
  course_price: string;
  batch: string;
  tutor: string;
  tutor_id: number | null; // ✅ number or null
}


export default function StudentAddForm() {
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
    tutor_id: null, // ✅ initial null
  });



  const [documents, setDocuments] = useState({
    passport_photo: null as File | null,
    pan_card: null as File | null,
    aadhar_card: null as File | null,
    sslc_marksheet: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // First Name
    if (!formData.name.trim()) {
      newErrors.name = "First name is required";
    } else if (!/^[A-Za-z]{4,30}$/.test(formData.name)) {
      newErrors.name = "Name must be 4–30 letters only";
    }

    // Last Name
    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
    } else if (formData.last_name.length > 4) {
      newErrors.last_name = "Last name must be at most 4 characters long";
    } else if (!/^[A-Za-z\s]+$/.test(formData.last_name)) {
      newErrors.last_name = "Last name must contain only letters";
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 21) {
        newErrors.dob = "Student must be at least 21 years old";
      }
    }

    if (!formData.gender) newErrors.gender = "Gender is required";

    // Email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[\w-.]+@(gmail\.com|yahoo\.com|outlook\.com|[\w-]+\.org)$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Invalid or unsupported email domain";
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.alt_phone) {
      newErrors.alt_phone = "Alternate phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.alt_phone)) {
      newErrors.alt_phone = "Invalid alternate phone number";
    }

    // Aadhaar
    if (!/^\d{12}$/.test(formData.aadhar_number || "")) {
      newErrors.aadhar_number = "Aadhar must be 12 digits";
    }

    // PAN
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_number)) {
      newErrors.pan_number = "Invalid PAN number format";
    }

    // Address ✅ length validation
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10 || formData.address.length > 100) {
      newErrors.address = "Address must be between 10 and 100 characters";
    }

    // Pincode
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    // State ✅ length validation
    if (!formData.state) {
      newErrors.state = "State is required";
    } else if (formData.state.length < 2 || formData.state.length > 30) {
      newErrors.state = "State must be between 2 and 30 characters";
    }

    // Department ✅ length validation
    if (!formData.department) {
      newErrors.department = "Department is required";
    } else if (formData.department.length < 2 || formData.department.length > 50) {
      newErrors.department = "Department must be 2–50 characters";
    }

    // Course ✅ length validation
    if (!formData.course) {
      newErrors.course = "Course is required";
    } else if (formData.course.length < 2 || formData.course.length > 50) {
      newErrors.course = "Course must be 2–50 characters";
    }

    // Year of Passed
    if (!/^(19|20)\d{2}$/.test(formData.year_of_passed)) {
      newErrors.year_of_passed = "Enter a valid year (e.g. 2022)";
    }

    // Experience ✅ length validation
    if (!formData.experience) {
      newErrors.experience = "Experience is required";
    } else if (formData.experience.length > 20) {
      newErrors.experience = "Experience must be at most 20 characters";
    }

    if (!formData.department_stream.trim()) {
      newErrors.department_stream = "Department / Stream is required";
    } else if (!/^[A-Za-z]+$/.test(formData.department_stream)) {
      newErrors.department_stream = "Only letters allowed";
    } else if (formData.department_stream.length > 20) {
      newErrors.department_stream = "Must be at most 20 characters";
    }

    if (!formData.course_duration.trim()) {
      newErrors.course_duration = "Course Duration is required";
    } else if (!/^\d+$/.test(formData.course_duration)) {
      newErrors.course_duration = "Only numbers are allowed";
    } else if (formData.course_duration.length > 20) {
      newErrors.course_duration = "Must be at most 20 digits";
    }


    if (!formData.join_date) newErrors.join_date = "Join date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";


    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.tutor) newErrors.tutor = "Tutor is required";

    // File uploads
    if (!documents.passport_photo)
      newErrors.passport_photo = "Passport photo is required";
    if (!documents.pan_card) newErrors.pan_card = "PAN card is required";
    if (!documents.aadhar_card)
      newErrors.aadhar_card = "Aadhar card is required";
    if (!documents.sslc_marksheet)
      newErrors.sslc_marksheet = "SSLC marksheet is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();

    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value !== null && value !== undefined) {
        data.append(key, String(value)); // convert everything to string
      }
    }


    if (documents.passport_photo)
      data.append("passport_photo", documents.passport_photo);
    if (documents.pan_card) data.append("pan_card", documents.pan_card);
    if (documents.aadhar_card) data.append("aadhar_card", documents.aadhar_card);
    if (documents.sslc_marksheet)
      data.append("sslc_marksheet", documents.sslc_marksheet);

    try {
      const response = await fetch(
        "https://nystai-backend.onrender.com/insert-student",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // ✅ Check backend validation errors
        if (result.fields) {
          Object.entries(result.fields).forEach(([field, value]: any) => {
            if (!value.success && value.msg) {
              toast.error(`${field}: ${value.msg}`);
            }
          });
        } else {
          toast.error(result.message || "Something went wrong");
        }
        return;
      }

      // ✅ Success
      toast.success("Student inserted! ID: " + result.student_id);

    } catch (err: any) {
      if (err.name === "TypeError") {
        toast.error("Network/CORS error: Backend not reachable");
      } else {
        toast.error(err.message || "Unexpected error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const [availableCourses, setAvailableCourses] = useState<
    { id: number; course_name: string; price: string }[]
  >([]);



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://nystai-backend.onrender.com/Allcourses/all-courses-with-plans");
        const result = await response.json();

        if (result.success) {
          setAvailableCourses(result.data); // ✅ put fetched courses in state
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const [availableTutors, setAvailableTutors] = useState<
    { tutor_id: number; full_name: string }[]
  >([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(
          "https://nystai-backend.onrender.com/NystaiTutors/getalltutors"
        );
        const result = await response.json();

        if (result.success) {
          // Map API response into { tutor_id, full_name }
          const tutors = result.tutors.map((tutor: any) => ({
            tutor_id: tutor.tutor_id,
            full_name: `${tutor.first_name} ${tutor.last_name || ""}`.trim(),
          }));
          setAvailableTutors(tutors);
        } else {
          console.error("Failed to fetch tutors");
        }
      } catch (err) {
        console.error("Error fetching tutors:", err);
      }
    };

    fetchTutors();
  }, []);



  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6" >
          <div className="space-y-6" >
            {/* Heading design */}
            <h2
              className="text-xl font-semibold text-gray-800 dark:text-white/90"
              x-text="pageName"
            >
              Add Student Form
            </h2>

            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Personal Details
            </h3>

            {/* input form  */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>First Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="John"
                      type="text"
                      className={`${errors.name ? 'border border-red-500' : ''}`}
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^A-Za-z]/g, '');
                        if (value.length <= 20) { // max length check
                          setFormData({ ...formData, name: value });
                        }
                      }}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}

                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Last Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="Doe"
                      type="text"
                      className={`${errors.last_name ? 'border border-red-500' : ''}`}
                      value={formData.last_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // allows only A-Z, a-z
                        setFormData({ ...formData, last_name: onlyLetters });
                      }}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Date of Birth</Label>
                  <DatePicker
                    id="dob"
                    placeholder="Select date of birth"
                    maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
                    value={formData.dob ? new Date(formData.dob) : undefined}
                    onChange={(date) => {
                      const selectedDate = Array.isArray(date) ? date[0] : date;

                      if (selectedDate) {
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                        const day = String(selectedDate.getDate()).padStart(2, "0");

                        setFormData({
                          ...formData,
                          dob: `${year}-${month}-${day}`, // ✅ Local date, no timezone shift
                        });
                      } else {
                        setFormData({
                          ...formData,
                          dob: "",
                        });
                      }
                    }}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
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
                      value={formData.gender} //  controlled value
                      onSelect={(value) => setFormData({ ...formData, gender: value })}
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Mail ID</Label>
                  <div className="relative">
                    <Input placeholder="info@gmail.com" type="email" className={`${errors.last_name ? 'border border-red-500' : ''}`} value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Input placeholder="9876543210" type="tel" className={`${errors.last_name ? 'border border-red-500' : ''}`} value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Alternate Phone</Label>
                  <div className="relative">
                    <Input
                      placeholder="9876543211"
                      type="tel"
                      value={formData.alt_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, alt_phone: e.target.value })
                      }
                      className={`${errors.alt_phone ? 'border border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}

                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Aadhar Number</Label>
                  <div className="relative">
                    <Input placeholder="XXXX-XXXX-XXXX" type="text" className={`${errors.last_name ? 'border border-red-500' : ''}`} value={formData.aadhar_number}
                      onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })} />
                    {errors.aadhar_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.aadhar_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>PAN Number</Label>
                  <div className="relative">
                    <Input placeholder="ABCDE1234F" type="text" className={`${errors.last_name ? 'border border-red-500' : ''}`} value={formData.pan_number}
                      onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })} />
                    {errors.pan_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
                    )}
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
                      className={`${errors.address ? 'border border-red-500' : ''}`}
                      value={formData.address}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          setFormData({ ...formData, address: e.target.value });
                        }
                      }}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}

                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Pincode</Label>
                  <div className="relative">
                    <Input
                      placeholder="600001"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      className={`${errors.pincode ? 'border border-red-500' : ''}`}
                      value={formData.pincode}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, ''); // Remove non-digits including spaces
                        if (onlyNums.length <= 6) {
                          setFormData({ ...formData, pincode: onlyNums });
                        }
                      }}
                    />
                  </div>

                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>State</Label>
                  <div className="relative">
                    <Input
                      placeholder="Tamil Nadu"
                      type="text"
                      className={`${errors.state ? 'border border-red-500' : ''}`}
                      value={formData.state}
                      onChange={(e) => {
                        const onlyChars = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        if (onlyChars.length <= 30) {
                          setFormData({ ...formData, state: onlyChars });
                        }
                      }}
                    />

                  </div>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              {/* Department */}
              <div className="space-y-6">
                <div>
                  <Label>Department</Label>
                  <div className="relative">
                    {/* Department */}
                    <Input
                      placeholder="Department Name"
                      type="text"
                      className={`${errors.department ? 'border border-red-500' : ''}`}
                      value={formData.department}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        if (val.length <= 20) {
                          setFormData({ ...formData, department: val });
                        }
                      }}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                  )}
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
                      className={`${errors.course ? 'border border-red-500' : ''}`}
                      value={formData.course}
                      onChange={(e) => {
                        if (e.target.value.length <= 20) {
                          setFormData({ ...formData, course: e.target.value });
                        }
                      }}
                    />
                  </div>

                  {/* Error message */}
                  {errors.course && (
                    <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                  )}
                </div>
              </div>

              {/* Year Of Passed */}
              <div className="space-y-6">
                <div>
                  <Label>Year Of Passed</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 2022"
                      type="text"
                      className={`${errors.year_of_passed ? 'border border-red-500' : ''}`}
                      value={formData.year_of_passed}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, year_of_passed: numbersOnly });
                      }}
                    />
                  </div>

                  {/* Error message */}
                  {errors.year_of_passed && (
                    <p className="text-red-500 text-sm mt-1">{errors.year_of_passed}</p>
                  )}
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
                      className={`${errors.experience ? 'border border-red-500' : ''}`}
                      value={formData.experience}
                      onChange={(e) => {
                        if (e.target.value.length <= 10) {
                          setFormData({ ...formData, experience: e.target.value });
                        }
                      }}
                    />
                  </div>

                  {/* Error message */}
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Heading design */}
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Academic & Course Details
            </h3>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
              <div className="space-y-6">
                <div>
                  <Label>Department / Stream</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. ComputerScience"
                      type="text"
                      value={formData.department_stream}
                      className={`${errors.department_stream ? 'border border-red-500' : ''}`}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[A-Za-z]*$/.test(value) && value.length <= 20) {
                          setFormData({ ...formData, department_stream: value });
                        }
                      }}
                    />
                  </div>
                  {errors.department_stream && (
                    <p className="text-red-500 text-sm mt-1">{errors.department_stream}</p>
                  )}
                </div>
              </div>


              <div className="space-y-6">
                <div>
                  <Label>Course Duration</Label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. 12"
                      type="text"
                      className={`${errors.course_duration ? 'border border-red-500' : ''}`}
                      value={formData.course_duration}
                      onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                        if (numbersOnly.length <= 20) {
                          setFormData({ ...formData, course_duration: numbersOnly });
                        }
                      }}
                    />
                    {errors.course_duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.course_duration}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <DatePicker
                  id="join-date-picker"
                  label="Join Date"
                  placeholder="Select a date"
                  maxDate={new Date()} // ✅ only past & today allowed
                  value={
                    formData.join_date && !isNaN(Date.parse(formData.join_date))
                      ? new Date(formData.join_date)
                      : undefined
                  }
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;
                    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                      // Format date in local timezone (YYYY-MM-DD)
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;

                      setFormData((prev) => ({
                        ...prev,
                        join_date: formattedDate,
                      }));
                      setErrors((prev) => ({ ...prev, join_date: "" })); // clear error
                    }
                  }}
                />

                {errors.join_date && (
                  <p className="text-red-500 text-sm">{errors.join_date}</p>
                )}
              </div>


              <div className="space-y-2">
                <DatePicker
                  id="end-date-picker"
                  label="End Date"
                  placeholder="Select a date"
                  minDate={new Date()}
                  value={
                    formData.end_date && !isNaN(Date.parse(formData.end_date))
                      ? new Date(formData.end_date)
                      : undefined
                  }
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;
                    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                      // Format in local time (YYYY-MM-DD)
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;

                      setFormData((prev) => ({
                        ...prev,
                        end_date: formattedDate,
                      }));
                      setErrors((prev) => ({ ...prev, end_date: "" })); // clear error
                    }
                  }}
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm">{errors.end_date}</p>
                )}
              </div>


            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">

              {/* Course Enrolled */}
              <div className="space-y-2">
                <Label>Course Enrolled</Label>
                <div className="relative">
                  <CustomDropdown
                    options={availableCourses.map((course) => course.course_name)}
                    value={formData.course_enrolled}
                    onSelect={(value) => {
                      const selectedCourse = availableCourses.find(
                        (course) => course.course_name === value
                      );
                      setFormData({
                        ...formData,
                        course_enrolled: value,
                        course_price: selectedCourse ? selectedCourse.price : "", // ✅ add this
                      });
                    }}

                  />

                  {errors.course_enrolled && (
                    <p className="text-red-500 text-sm mt-1">{errors.course_enrolled}</p>
                  )}
                </div>
              </div>


              {/* Course Price */}
              <div className="space-y-2">
                <Label>Course Price</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formData.course_price}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>


              {/* Batch */}
              <div className="space-y-2">
                <Label>Batch</Label>
                <div className="relative">
                  <Input
                    className={`${errors.course_duration ? 'border border-red-500' : ''}`}
                    placeholder="e.g. A"
                    type="text"
                    value={formData.batch}
                    onChange={(e) => {
                      let inputValue = e.target.value.toUpperCase();

                      // Allow only letters and limit length to 3 characters
                      if (/^[A-Z]*$/.test(inputValue) && inputValue.length <= 1) {
                        setFormData({ ...formData, batch: inputValue });
                      }
                    }}
                  />

                  {errors.batch && (
                    <p className="text-red-500 text-sm mt-1">{errors.batch}</p>
                  )}
                </div>
              </div>

              {/* Tutor */}
              <div className="space-y-2">
                <Label>Tutor</Label>
                <div className="relative">
                  <CustomDropdown
                    options={availableTutors.map((tutor) => tutor.full_name)}
                    value={formData.tutor}
                    onSelect={(value) => {
                      const selectedTutor = availableTutors.find((t) => t.full_name === value);
                      setFormData({
                        ...formData,
                        tutor: selectedTutor ? selectedTutor.full_name : "",
                        tutor_id: selectedTutor ? selectedTutor.tutor_id : null,
                      });
                    }}
                  />

                  {errors.tutor && (
                    <p className="text-red-500 text-sm mt-1">{errors.tutor}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Heading design */}
            <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
              Upload Documents
            </h3>

            {/* UPLOAD IMAGE  */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label> Pan Card</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, pan_card: file }))} />
                {errors.pan_card && (
                  <p className="text-red-500 text-sm mt-1">{errors.pan_card}</p>
                )}
              </div>
              <div className="space-y-6">
                <Label>Aadhar Card</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, aadhar_card: file }))} />
                {errors.aadhar_card && (
                  <p className="text-red-500 text-sm mt-1">{errors.aadhar_card}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <Label> SSLC Marksheet</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, sslc_marksheet: file }))} />
                {errors.sslc_marksheet && (
                  <p className="text-red-500 text-sm mt-1">{errors.sslc_marksheet}</p>
                )}
              </div>
              <div className="space-y-6">
                <Label> Passport Size Photo</Label>
                <FileUploadBox onFileSelect={(file) => setDocuments(prev => ({ ...prev, passport_photo: file }))} />
                {errors.passport_photo && (
                  <p className="text-red-500 text-sm mt-1">{errors.passport_photo}</p>
                )}
              </div>
            </div>

            {/* BTN  */}
            <div className="grid xl:grid-cols-2 gap-6">
              <div className="col-span-full flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className=" text-white px-4 py-2 rounded disabled:opacity-60 flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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
  value: T; // controlled selected value
  onSelect?: (value: T) => void;
  className?: string; // optional comment if desired
};

export function CustomDropdown<T extends string>({
  label = "Select",
  options = [],
  value,
  className = "",
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

  const handleSelect = (val: T) => {
    setIsOpen(false);
    onSelect?.(val);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-700
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {value || label}
      </button>

      <span
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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

import { useCallback } from "react";
import { Trash2 } from "lucide-react";


function FileUploadBox({ onFileSelect }: { onFileSelect: (file: File | null) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file); // Pass file to parent
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => {
    setSelectedFile(null);
    onFileSelect(null); // Clear in parent
  };

  // Render uploaded file preview card
  if (selectedFile) {
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);


    return (
      <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
        <div className="flex items-center gap-4">
          {/* File icon */}
          <div className="">
            <img
              src={Uploadafter}
              alt="Preview"
              className="h-12 w-12 object-contain"
            />
          </div>
          {/* File name and size */}
          <div>
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  // Render upload dropzone
  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[176px]">
      <form
        {...getRootProps()}
        className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10
      ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}
    `}
        id="demo-upload"
      >
        <input {...getInputProps()} />
        <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
          {/* Icon Container */}
          <div className="flex justify-center items-center shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
            </div>
          </div>

          {/* Text Content */}
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
