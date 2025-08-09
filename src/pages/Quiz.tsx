import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stepper } from "@/components/advisor/Stepper";
import { TagSelect } from "@/components/advisor/TagSelect";
import { TraitLikert } from "@/components/advisor/TraitLikert";
import { SubjectInputs } from "@/components/advisor/SubjectInputs";
import { computeScores, generateResultId, saveSubmission, type Traits, type Submission } from "@/utils/scoring";
import demoProfiles from "@/data/demoProfiles.json";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const PREFERENCES = ["Công nghệ","Sáng tạo","Phân tích","Truyền thông","Kinh doanh","Làm việc nhóm","Làm việc độc lập","Kỷ luật","Dịch vụ khách hàng"];
const ORIENTATIONS = ["Kỹ thuật","Kinh tế - Truyền thông","Vận hành - Kỹ thuật","Dịch vụ","Khởi nghiệp","Sản phẩm số"];
const HABITS = ["Tự học","Thực hành - dự án","Ghi chép - ôn tập","Thảo luận nhóm"];

const initialTraits: Traits = { logic:3, creativity:3, communication:3, meticulous:3, leadership:3, patience:3 };

export default function Quiz(){
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [traits, setTraits] = useState<Traits>(initialTraits);
  const [scores, setScores] = useState({ math:0, literature:0, english:0, informatics:0, physics:0, chemistry:0 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orientation, setOrientation] = useState(ORIENTATIONS[0]);
  const [habits, setHabits] = useState(HABITS[0]);

  const totalSteps = 7; // 6 steps + review
  const canNext = useMemo(()=>{
    if(step===0) return name.trim().length>0; // basic info
    if(step===1) return preferences.length>0;
    if(step===3) return favorites.length>0; // subjects
    return true;
  }, [step, name, preferences, favorites]);

  // autosave
  useEffect(()=>{
    const raw = localStorage.getItem("advisor_current");
    if(raw){
      try{
        const s = JSON.parse(raw);
        setName(s.name||""); setEmail(s.email||""); setPreferences(s.preferences||[]); setTraits(s.traits||initialTraits);
        setScores(s.scores||{}); setFavorites(s.favorites||[]); setOrientation(s.orientation||ORIENTATIONS[0]); setHabits(s.habits||HABITS[0]);
      }catch{}
    }
  },[]);
  useEffect(()=>{
    const s = { name,email,preferences,traits,scores,favorites,orientation,habits };
    localStorage.setItem("advisor_current", JSON.stringify(s));
  }, [name,email,preferences,traits,scores,favorites,orientation,habits]);

  const loadDemo = (i:number)=>{
    const d = (demoProfiles as any[])[i];
    setName(d.name); setEmail(d.email); setPreferences(d.preferences); setTraits(d.traits); setScores(d.scores); setFavorites(d.favorites); setOrientation(d.orientation); setHabits(d.habits);
  };

  const reviewRef = useRef<HTMLDivElement>(null);

  const submit = () => {
    const id = generateResultId();
    const submission: Submission = { id, name, email, preferences, traits, scores, favorites, orientation, habits, createdAt: Date.now() };
    const result = computeScores(submission);
    saveSubmission(result);
    navigate(`/result/${id}`);
  };

  const next = () => setStep(s=> Math.min(totalSteps-1, s+1));
  const prev = () => setStep(s=> Math.max(0, s-1));

  return (
    <div className="container mx-auto py-8">
      <SEO title="Tư vấn chọn ngành – AI Major Advisor" description="Form nhiều bước giúp bạn nhận 3 ngành phù hợp nhất tại FPT Polytechnic." />
      <div className="max-w-3xl mx-auto space-y-6">
        <Stepper step={step} total={totalSteps} />

        {step===0 && (
          <Card>
            <CardHeader><CardTitle>1) Thông tin cơ bản</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div>
                <Label htmlFor="email">Email (không bắt buộc)</Label>
                <Input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </CardContent>
          </Card>
        )}

        {step===1 && (
          <Card>
            <CardHeader><CardTitle>2) Sở thích</CardTitle></CardHeader>
            <CardContent>
              <TagSelect options={PREFERENCES} values={preferences} onChange={setPreferences} />
            </CardContent>
          </Card>
        )}

        {step===2 && (
          <Card>
            <CardHeader><CardTitle>3) Kỹ năng/Tố chất</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              <TraitLikert label="Tư duy logic" value={traits.logic} onChange={(v)=>setTraits({...traits, logic:v})} />
              <TraitLikert label="Sáng tạo" value={traits.creativity} onChange={(v)=>setTraits({...traits, creativity:v})} />
              <TraitLikert label="Giao tiếp" value={traits.communication} onChange={(v)=>setTraits({...traits, communication:v})} />
              <TraitLikert label="Tỉ mỉ" value={traits.meticulous} onChange={(v)=>setTraits({...traits, meticulous:v})} />
              <TraitLikert label="Lãnh đạo" value={traits.leadership} onChange={(v)=>setTraits({...traits, leadership:v})} />
              <TraitLikert label="Kiên nhẫn" value={traits.patience} onChange={(v)=>setTraits({...traits, patience:v})} />
            </CardContent>
          </Card>
        )}

        {step===3 && (
          <Card>
            <CardHeader><CardTitle>4) Điểm số & môn yêu thích</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SubjectInputs scores={scores as any} onChange={(k,v)=>setScores({ ...(scores as any), [k]:v })} />
              <div>
                <Label>Môn yêu thích (1–2)</Label>
                <TagSelect options={["Toán","Văn","Anh","Tin","Vật lý","Hóa"]} values={favorites} onChange={(v)=> setFavorites(v.slice(0,2))} />
              </div>
            </CardContent>
          </Card>
        )}

        {step===4 && (
          <Card>
            <CardHeader><CardTitle>5) Định hướng & thói quen học tập</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Định hướng nghề nghiệp</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger><SelectValue placeholder="Chọn định hướng" /></SelectTrigger>
                  <SelectContent>
                    {ORIENTATIONS.map(o=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Thói quen học tập</Label>
                <Select value={habits} onValueChange={setHabits}>
                  <SelectTrigger><SelectValue placeholder="Chọn thói quen" /></SelectTrigger>
                  <SelectContent>
                    {HABITS.map(o=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {step===5 && (
          <Card>
            <CardHeader><CardTitle>6) Bonus: Gợi ý môn nên tập trung</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Dựa trên các trait thấp, bạn có thể tập trung cải thiện ở các môn liên quan: Logic ↔ Toán/Tin, Sáng tạo ↔ Thiết kế/Nội dung, Giao tiếp ↔ Ngôn ngữ/Thuyết trình, Tỉ mỉ ↔ Thực hành/Lab.
            </CardContent>
          </Card>
        )}

        {step===6 && (
          <Card ref={reviewRef}>
            <CardHeader><CardTitle>Review & Submit</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Họ tên:</strong> {name}</div>
              <div><strong>Sở thích:</strong> {preferences.join(", ")}</div>
              <div><strong>Traits:</strong> {Object.entries(traits).map(([k,v])=> `${k}:${v}`).join(" · ")}</div>
              <div><strong>Điểm:</strong> Toán {scores.math}, Văn {scores.literature}, Anh {scores.english}, Tin {scores.informatics}, Lý {scores.physics}, Hóa {scores.chemistry}</div>
              <div><strong>Yêu thích:</strong> {favorites.join(", ")}</div>
              <div><strong>Định hướng:</strong> {orientation} · <strong>Thói quen:</strong> {habits}</div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={()=>loadDemo(0)}>Tải demo A</Button>
            <Button variant="outline" onClick={()=>loadDemo(1)}>Tải demo B</Button>
            <Button variant="outline" onClick={()=>loadDemo(2)}>Tải demo C</Button>
          </div>
          <div className="flex gap-2">
            {step>0 && <Button variant="soft" onClick={prev}>Quay lại</Button>}
            {step<totalSteps-1 && <Button variant="default" onClick={next} disabled={!canNext}>Tiếp tục</Button>}
            {step===totalSteps-1 && <Button variant="hero" onClick={submit}>Gửi và xem kết quả</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
