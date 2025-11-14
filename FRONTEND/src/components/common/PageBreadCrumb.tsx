import { Link } from "react-router";


interface BreadcrumbProps {
  pageTitle: string;
  pageTitleLink?: string; // Optional link for pageTitle
  pageTitle1?: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  pageTitleLink,
  pageTitle1,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          <li className="inline-flex items-center gap-1.5 text-sm text-[#AF8908] dark:text-white/90">
            {pageTitleLink ? (
              <Link to={pageTitleLink} className="hover:underline">
                {pageTitle}
              </Link>
            ) : (
              pageTitle
            )}
          </li>

          {pageTitle1 && (
            <li className="inline-flex items-center gap-1.5 text-sm text-[#AF8908] dark:text-white/90">
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
                  {pageTitle1}
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
