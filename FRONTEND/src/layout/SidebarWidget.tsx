import { LogOut } from "lucide-react";
import { Link } from "react-router";

export default function SidebarWidget() {
  return (
   
    <div
      className={`
      mx-auto mb-10 w-full max-w-60 rounded-2xl px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <Link
        to="/signin"
        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-[#F8C723] px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 mx-auto text-center"
      >
        <LogOut size={18} />
        Sign out
      </Link>

      {/* <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Manage Admin Access
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Want to add another admin to the dashboard? Easily manage team access here.
      </p>
      <a
        href="/add-admin" // <-- update this to your actual route
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-600"
      >
        Add Another Admin
      </a> */}
    </div>

  );
}
