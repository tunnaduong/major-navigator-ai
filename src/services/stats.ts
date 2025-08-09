import { supabase } from "@/integrations/supabase/client";

export interface MajorStats {
  majorId: string;
  majorName: string;
  count: number;
  percentage: number;
}

export interface StatsData {
  totalQuizzes: number;
  majorStats: MajorStats[];
  recentQuizzes: number; // số quiz trong 7 ngày qua
  topMajors: MajorStats[]; // top 5 ngành được quan tâm nhất
}

// Lấy thống kê ngành học từ Supabase
export async function getMajorStats(): Promise<StatsData> {
  try {
    // Lấy tất cả kết quả quiz
    const { data: quizResults, error } = await supabase
      .from("quiz_results")
      .select("top_majors, created_at");

    if (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
      return {
        totalQuizzes: 0,
        majorStats: [],
        recentQuizzes: 0,
        topMajors: [],
      };
    }

    if (!quizResults || quizResults.length === 0) {
      return {
        totalQuizzes: 0,
        majorStats: [],
        recentQuizzes: 0,
        topMajors: [],
      };
    }

    // Đếm số lượng quiz
    const totalQuizzes = quizResults.length;

    // Đếm quiz trong 7 ngày qua
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentQuizzes = quizResults.filter(
      (result) => new Date(result.created_at) >= sevenDaysAgo
    ).length;

    // Đếm số lần mỗi ngành xuất hiện trong top 3
    const majorCounts: { [key: string]: { count: number; name: string } } = {};

    quizResults.forEach((result) => {
      if (result.top_majors && Array.isArray(result.top_majors)) {
        result.top_majors.forEach((major: any) => {
          const majorId = major.id || major.majorId;
          const majorName = major.name_vi || major.name || majorId;

          if (majorId) {
            if (!majorCounts[majorId]) {
              majorCounts[majorId] = { count: 0, name: majorName };
            }
            majorCounts[majorId].count++;
          }
        });
      }
    });

    // Chuyển đổi thành array và tính phần trăm
    const majorStats: MajorStats[] = Object.entries(majorCounts).map(
      ([majorId, data]) => ({
        majorId,
        majorName: data.name,
        count: data.count,
        percentage: Math.round((data.count / totalQuizzes) * 100),
      })
    );

    // Sắp xếp theo số lượng giảm dần
    majorStats.sort((a, b) => b.count - a.count);

    // Lấy top 5 ngành được quan tâm nhất
    const topMajors = majorStats.slice(0, 5);

    return {
      totalQuizzes,
      majorStats,
      recentQuizzes,
      topMajors,
    };
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    return {
      totalQuizzes: 0,
      majorStats: [],
      recentQuizzes: 0,
      topMajors: [],
    };
  }
}

// Lấy dữ liệu demo cho thống kê (nếu chưa có dữ liệu thật)
export function getDemoStats(): StatsData {
  return {
    totalQuizzes: 1247,
    recentQuizzes: 89,
    majorStats: [
      {
        majorId: "software",
        majorName: "Công nghệ thông tin - Ứng dụng phần mềm",
        count: 342,
        percentage: 27,
      },
      {
        majorId: "graphic-design",
        majorName: "Thiết kế đồ họa",
        count: 298,
        percentage: 24,
      },
      {
        majorId: "marketing",
        majorName: "Marketing",
        count: 236,
        percentage: 19,
      },
      {
        majorId: "business-admin",
        majorName: "Quản trị kinh doanh",
        count: 187,
        percentage: 15,
      },
      {
        majorId: "accounting",
        majorName: "Kế toán",
        count: 123,
        percentage: 10,
      },
      { majorId: "tourism", majorName: "Du lịch", count: 61, percentage: 5 },
    ],
    topMajors: [
      {
        majorId: "software",
        majorName: "Công nghệ thông tin - Ứng dụng phần mềm",
        count: 342,
        percentage: 27,
      },
      {
        majorId: "graphic-design",
        majorName: "Thiết kế đồ họa",
        count: 298,
        percentage: 24,
      },
      {
        majorId: "marketing",
        majorName: "Marketing",
        count: 236,
        percentage: 19,
      },
      {
        majorId: "business-admin",
        majorName: "Quản trị kinh doanh",
        count: 187,
        percentage: 15,
      },
      {
        majorId: "accounting",
        majorName: "Kế toán",
        count: 123,
        percentage: 10,
      },
    ],
  };
}
