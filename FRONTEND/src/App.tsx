import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import AllCourses from "./components/Courses/AllCourses";
import CourseDetail from "./components/Courses/Coursesdetails";
// import AllPricing from "./components/Pricing/allPricing";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Studentlist from "./pages/studentlist/studentlist";
import FormElements from "./pages/Forms/FormElements";
import ContactGrid from "./components/ContactGrid/ContactGrid";
import ListStudent from "./components/ContactGrid/ListStudent";
import ProfileCards from "./components/trainer/TutorList";
import AddNewTutor from "./components/trainer/AddNewTutor";
import Createtask from "./components/trainer/Createtask";
import Tasklist from "./components/trainer/tasklist.tsx";
import Taskstatus from "./components/trainer/taskstatus.tsx";
import StudentAssignment from "./components/trainer/StudentAssignment.tsx";
import Certificate from "./components/student/Certificate.tsx";
import StudentLogin from "./components/student/login.tsx";
import { Toaster } from "react-hot-toast";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Blank from "./pages/Blank";
import Studentcertification from "./components/studentlist/CertificateStatus";
import StudentEditForm from "./components/form/editstudentform/editstudentform.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Studentpdfdownload from "./components/studentpdfdownload/pdfdownload.tsx";

export default function App() {
  return (
    // <Provider store={store}>
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />
            <Route path="/Courses" element={<AllCourses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            {/* <Route path="/Pricing" element={<AllPricing />} /> */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/AddStudentForm" element={<FormElements />} />
            <Route path="/ContactGrid" element={<ContactGrid />} />
            <Route path="/ListStudent" element={<ListStudent />} />
            <Route path="/Trainers" element={<ProfileCards />} />
            <Route path="/AddNewTutor" element={<AddNewTutor />} />
            <Route path="/Createtask" element={<Createtask />} />
            <Route path="/tasklist/:taskId" element={<Tasklist />} />
            <Route path="/task/:taskId/student/:studentId" element={<Taskstatus />} />
            <Route path="/studentlist" element={<Studentlist />} />
            <Route path="/student/:id" element={<Studentcertification />} />
            <Route path="/Editstudentform/:id" element={<StudentEditForm />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/Student-PDF/:id" element={<Studentpdfdownload />} />
          </Route>

          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/Students-Tasks/assignment/:token/:studentId?" element={<StudentAssignment />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/certificate" element={<Certificate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
