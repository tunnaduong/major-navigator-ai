import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMajorStats, getDemoStats, type StatsData } from "@/services/stats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Màu sắc cho biểu đồ
const COLORS = [
  "#FF6B35", // FPT Orange
  "#004E89", // FPT Blue
  "#1A535C", // Dark Teal
  "#4ECDC4", // Light Teal
  "#F7931E", // Orange
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint Green
  "#FFEAA7", // Light Yellow
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">
          Số lượt quan tâm:{" "}
          <span className="font-bold">{payload[0].value}</span>
        </p>
        <p className="text-gray-600">
          Tỷ lệ:{" "}
          <span className="font-bold">{payload[0].payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const MajorStatsCharts = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const realStats = await getMajorStats();

        // Nếu không có dữ liệu thật, sử dụng dữ liệu demo
        if (realStats.totalQuizzes === 0) {
          setStats(getDemoStats());
          setUseDemo(true);
        } else {
          setStats(realStats);
          setUseDemo(false);
        }
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
        setStats(getDemoStats());
        setUseDemo(true);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đang tải thống kê...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đang tải biểu đồ...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không thể tải thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Có lỗi xảy ra khi tải dữ liệu thống kê.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Chuẩn bị dữ liệu cho biểu đồ cột
  const barChartData = stats.topMajors.map((major) => ({
    name:
      major.majorName.length > 25
        ? major.majorName.substring(0, 25) + "..."
        : major.majorName,
    fullName: major.majorName,
    value: major.count,
    percentage: major.percentage,
  }));

  // Chuẩn bị dữ liệu cho biểu đồ tròn
  const pieChartData = stats.topMajors.map((major, index) => ({
    name:
      major.majorName.length > 20
        ? major.majorName.substring(0, 20) + "..."
        : major.majorName,
    fullName: major.majorName,
    value: major.count,
    percentage: major.percentage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalQuizzes.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">Tổng số lượt tư vấn</p>
            {useDemo && (
              <span className="text-xs text-orange-500">(Dữ liệu demo)</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.recentQuizzes.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">Tư vấn trong tuần</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.topMajors.length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Ngành được quan tâm</p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Biểu đồ cột */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Ngành học được quan tâm nhiều nhất
            </CardTitle>
            <p className="text-sm text-gray-600">
              Top 5 ngành có nhiều lượt tư vấn nhất
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ tròn */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Phân bố ngành học
            </CardTitle>
            <p className="text-sm text-gray-600">
              Tỷ lệ phần trăm các ngành được quan tâm
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value} lượt (${props.payload.percentage}%)`,
                    props.payload.fullName,
                  ]}
                />
                <Legend
                  formatter={(value: string, entry: any) =>
                    entry.payload.fullName
                  }
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Danh sách chi tiết */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Chi tiết thống kê ngành học
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.majorStats.slice(0, 8).map((major, index) => (
              <div
                key={major.majorId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="font-medium">{major.majorName}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">{major.count} lượt</span>
                  <span className="font-semibold text-blue-600">
                    {major.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MajorStatsCharts;
