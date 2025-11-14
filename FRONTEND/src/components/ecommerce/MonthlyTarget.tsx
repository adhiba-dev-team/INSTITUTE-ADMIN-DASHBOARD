import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";

export default function MonthlyTarget() {
  const [data, setData] = useState<
    { id: number; value: number; label: string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://nystai-backend.onrender.com/students/course-counts"
        );
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const colors = ["#FFEB3B", "#FFBF00", "#F5B700", "#FFC107"];
          const formattedData = result.data.map(
            (item: { course: string; student_count: number }, idx: number) => ({
              id: idx,
              value: item.student_count,
              label: item.course,
              color: colors[idx % colors.length],
            })
          );

          setData(formattedData);
        } else {
          console.error("Invalid API response:", result);
        }
      } catch (err) {
        console.error("Failed to fetch course counts:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] px-5 p-5">
        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Traffic by Courses
        </h3>

        {/* Chart + List */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Pie Chart */}
          <div className="flex justify-center">
            {data.length > 0 ? (
              <PieChart
                width={300}
                height={300}
                series={[
                  {
                    data,
                    innerRadius: 50,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -60,
                    endAngle: 300,
                    cx: 150,
                    cy: 150,
                  },
                ]}
              />
            ) : (
              <p className="text-gray-500 text-sm">Loading PieChart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
