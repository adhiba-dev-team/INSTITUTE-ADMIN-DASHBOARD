import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import PageMeta from '../common/PageMeta';
import PageBreadcrumb from '../common/PageBreadCrumb';

interface Student {
  student_id: number;
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
  course_enrolled: string;
  course_price: string;
  batch: string;
  tutor: string;
  studentregisternumber: string;
  passport_photo_url: string;
  join_date: string;
  end_date: string;
  certificate_status: string;
  certificate_id: string;
}

export default function Studentpdfdownload() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      // Get student_id from URL path (e.g., /Student-PDF/213)
      const pathParts = window.location.pathname.split('/');
      const studentId = pathParts[pathParts.length - 1];

      const response = await fetch(`https://nystai-backend.onrender.com/single-student/${studentId}`);
      const result = await response.json();
      if (result.success) {
        setStudent(result.data);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading student information...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Student not found</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="All Courses - Nystai Institute" description="All available courses" />
      <PageBreadcrumb pageTitle="Student Registration Form" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Student Registration Form</h3>

        </div>
        <div className="min-h-screen py-8 px-4 print:p-0">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex justify-end print:hidden">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#FBC723] text-white px-6 py-3 rounded-lg hover:bg-[#FBC72390] transition-colors"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>

            <div id="pdf-content" className="bg-white shadow-lg">
              <div className="bg-[#FBC723] text-white text-center py-6">
                <h1 className="text-3xl font-bold">NYSTAI INSTITUTE</h1>
                <p className="text-sm mt-2">Student Registration Form</p>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-300">
                  <div className="flex-1">
                    {/* <div className="mb-2">
                  <span className="font-semibold">Registration No:</span>
                  <span className="ml-2">{student.studentregisternumber}</span>
                </div> */}
                    <div className="mb-2">
                      <span className="font-semibold">Course:</span>
                      <span className="ml-2">{student.course_enrolled}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Course Price:</span>
                      <span className="ml-2">{student.course_price}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Batch:</span>
                      <span className="ml-2">{student.batch}</span>
                    </div>
                  </div>
                  <div className="w-30 h-30 border-2 border-gray-300 overflow-hidden">
                    <img
                      src={student.passport_photo_url}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold bg-gray-200 px-4 py-2 mb-4">Personal Details</h2>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex">
                      <span className="font-semibold w-30">Full Name:</span>
                      <span>{student.name} {student.last_name}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Date of Birth:</span>
                      <span>{formatDate(student.dob)}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Age:</span>
                      <span>{calculateAge(student.dob)} Y</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Gender:</span>
                      <span>{student.gender}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Mobile:</span>
                      <span>{student.phone}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Alt. Mobile:</span>
                      <span>{student.alt_phone}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Email:</span>
                      <span className="text-sm">{student.email}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Aadhar No:</span>
                      <span>{student.aadhar_number}</span>
                    </div>

                    <div className="flex col-span-2">
                      <span className="font-semibold w-30">Address:</span>
                      <span>{student.address}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">State:</span>
                      <span>{student.state}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Pincode:</span>
                      <span>{student.pincode}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold bg-gray-200 px-4 py-2 mb-4">Course Details</h2>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex">
                      <span className="font-semibold w-30">Department:</span>
                      <span>{student.department}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Course:</span>
                      <span>{student.course}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Year of Passed:</span>
                      <span>{student.year_of_passed}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Experience:</span>
                      <span>{student.experience} years</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Tutor:</span>
                      <span>{student.tutor}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Join Date:</span>
                      <span>{formatDate(student.join_date)}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">End Date:</span>
                      <span>{formatDate(student.end_date)}</span>
                    </div>

                    <div className="flex">
                      <span className="font-semibold w-30">Certificate Status:</span>
                      <span className="capitalize">{student.certificate_status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8 break-before-page">
                  <h2 className="text-xl font-bold bg-gray-200 px-4 py-2 mb-4">Terms and Conditions</h2>

                  <div className="space-y-3 text-sm px-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="term1"
                        className="mt-1 w-4 h-4 flex-shrink-0"
                        defaultChecked
                      />
                      <label htmlFor="term1" className="text-gray-700">
                        I agree to abide by all the rules and regulations of NYSTAI Institute during my course period.
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="term2"
                        className="mt-1 w-4 h-4 flex-shrink-0"
                        defaultChecked
                      />
                      <label htmlFor="term2" className="text-gray-700">
                        I understand that fees once paid are non-refundable and non-transferable under any circumstances.
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="term3"
                        className="mt-1 w-4 h-4 flex-shrink-0 bg-[#FBC723]"
                        defaultChecked
                      />
                      <label htmlFor="term3" className="text-gray-700">
                        I certify that all information provided in this form is true and accurate to the best of my knowledge.
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="term4"
                        className="mt-1 w-4 h-4 flex-shrink-0"
                        defaultChecked
                      />
                      <label htmlFor="term4" className="text-gray-700">
                        I agree to maintain a minimum of 75% attendance throughout the course duration.
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="term5"
                        className="mt-1 w-4 h-4 flex-shrink-0"
                        defaultChecked
                      />
                      <label htmlFor="term5" className="text-gray-700">
                        I authorize NYSTAI Institute to use my academic performance and project work for promotional purposes.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-12 mb-6">
                  <div className="text-center">
                    <div className="w-48 h-24 border-2 border-gray-400 mb-2 flex items-center justify-center bg-gray-50">
                      <span className="text-gray-400 text-sm">Institute Seal</span>
                    </div>
                    <div className="border-t-2 border-gray-800 pt-2">
                      <p className="font-semibold">Authorized Seal</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-48 h-24 mb-2"></div>
                    <div className="border-t-2 border-gray-800 pt-2 w-48">
                      <p className="font-semibold">Student Signature</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                  {/* <p>Generated on {new Date().toLocaleDateString('en-IN')}</p> */}
                </div>
              </div>
            </div>
          </div>

          <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-content, #pdf-content * {
            visibility: visible;
          }
          #pdf-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .break-before-page {
            page-break-before: always;
            break-before: page;
          }
        }
      `}</style>
        </div>
      </div>
    </>
  );
}