import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import majors from "@/data/majors.json";
import { Link } from "react-router-dom";

export default function Admin() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const listKey = "advisor_results_index";
    const raw = localStorage.getItem(listKey);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  const filtered = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())),
    [q, items]
  );

  const topName = (id: string) =>
    majors.find((m) => m.id === id)?.name_vi || id;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SEO
        title="Admin – Submissions"
        description="Danh sách submissions demo (lưu local)."
      />

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Submissions (Local)</CardTitle>
          <Input
            placeholder="Tìm theo tên..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Họ tên</th>
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Top ngành</th>
                  <th className="py-2">Xem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td className="py-2">{i.name}</td>
                    <td className="py-2">
                      {new Date(i.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2">{topName(i.top?.[0]?.majorId)}</td>
                    <td className="py-2">
                      <Link
                        to={`/result/${i.id}`}
                        className="text-primary hover:underline"
                      >
                        Kết quả
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
