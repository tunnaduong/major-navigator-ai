import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import majors from "@/data/majors.json";
import { Link } from "react-router-dom";
import { setupDatabase, testSupabaseConnection } from "@/utils/setupDatabase";

export default function Admin(){
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<string>("");

  useEffect(()=>{
    const listKey = "advisor_results_index";
    const raw = localStorage.getItem(listKey);
    setItems(raw? JSON.parse(raw): []);
  },[]);

  const handleTestConnection = async () => {
    setDbStatus("Đang kiểm tra...");
    const isConnected = await testSupabaseConnection();
    if (isConnected) {
      const isSetup = await setupDatabase();
      setDbStatus(isSetup ? "✅ Sẵn sàng sử dụng" : "⚠️ Cần chạy migration");
    } else {
      setDbStatus("❌ Lỗi kết nối");
    }
  };

  const filtered = useMemo(()=> items.filter((i)=> i.name.toLowerCase().includes(q.toLowerCase())), [q, items]);

  const topName = (id:string)=> majors.find(m=> m.id === id)?.name_vi || id;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <SEO title="Admin – Submissions" description="Danh sách submissions demo (lưu local)." />
      
      {/* Supabase Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>🗄️ Supabase Database Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 items-center">
            <Button onClick={handleTestConnection} variant="outline">
              Test Kết nối Supabase
            </Button>
            {dbStatus && <span className="text-sm">{dbStatus}</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            QR code cần Supabase để hoạt động trên mọi thiết bị. Nếu hiện "⚠️ Cần chạy migration", 
            vui lòng copy SQL từ console và chạy trong Supabase dashboard.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Submissions (Local)</CardTitle>
          <Input placeholder="Tìm theo tên..." value={q} onChange={(e)=>setQ(e.target.value)} className="max-w-xs" />
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
                {filtered.map((i)=> (
                  <tr key={i.id} className="border-b">
                    <td className="py-2">{i.name}</td>
                    <td className="py-2">{new Date(i.createdAt).toLocaleString()}</td>
                    <td className="py-2">{topName(i.top?.[0]?.majorId)}</td>
                    <td className="py-2"><Link to={`/result/${i.id}`} className="text-primary hover:underline">Kết quả</Link></td>
                  </tr>
                ))}
                {filtered.length===0 && (
                  <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
