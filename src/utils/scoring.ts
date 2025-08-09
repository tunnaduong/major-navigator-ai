import majors from "@/data/majors.json";

export type TraitKey = "logic"|"creativity"|"communication"|"meticulous"|"leadership"|"patience";
export type Traits = Record<TraitKey, number>; // 1-5
export type Scores = { math:number; literature:number; english:number; informatics:number; physics:number; chemistry:number };

export type Submission = {
  id: string;
  name: string;
  email?: string;
  preferences: string[];
  traits: Traits;
  scores: Scores;
  favorites: string[]; // 1-2 subjects
  orientation: string;
  habits: string;
  createdAt: number;
};

export type Major = {
  id: string;
  name_vi: string;
  name_en: string;
  description: string;
  traits: number[]; // length 6 order matches TraitKey
};

export type Result = {
  id: string;
  top: Array<{ majorId:string; score:number }>;
  reasons: string;
  submission: Submission;
};

const TRAIT_ORDER: TraitKey[] = ["logic","creativity","communication","meticulous","leadership","patience"];

function normalizeTraits(t: Traits){
  return TRAIT_ORDER.map(k => (t[k] - 1) / 4); // 0..1
}

function subjectAffinityMap(majorId:string, sub: Scores, fav: string[]) {
  // simple heuristic mapping
  const s = sub;
  const favBoost = (subj:string) => fav.includes(subj) ? 1.1 : 1.0;
  const avg = (a:number,b:number)=> (a+b)/2;
  const core = (():number => {
    switch(majorId){
      case "software": case "webdev": return avg(s.math, s.informatics) * favBoost("Toán");
      case "ai": case "data": return avg(s.math, s.informatics) * favBoost("Toán");
      case "cybersec": return avg(s.math, s.informatics) * favBoost("Tin");
      case "graphic": case "multimedia": return avg(s.english, s.literature) * favBoost("Văn");
      case "marketing": case "emarket": return avg(s.english, s.literature);
      case "business": return avg(s.literature, s.english);
      case "hotel": case "tourism": return avg(s.english, s.literature);
      case "mechatronics": case "electronics": case "automotive": return avg(s.math, s.physics) * favBoost("Vật lý");
      case "logistics": return avg(s.math, s.english);
      default: return (s.math + s.english + s.informatics)/3;
    }
  })();
  return core / 10; // normalize to 0..1
}

function orientationBoost(majorId:string, orientation:string){
  const m = orientation.toLowerCase();
  const pairs:[string,RegExp][] = [
    ["ai", /(ai|trí tuệ nhân tạo|dữ liệu|data|machine)/],
    ["data", /(data|dữ liệu)/],
    ["software", /(kỹ thuật|it|phần mềm|software|dev)/],
    ["webdev", /(web|frontend|backend)/],
    ["cybersec", /(bảo mật|security)/],
    ["graphic", /(thiết kế|design|ui|ux)/],
    ["marketing", /(marketing|truyền thông)/],
    ["emarket", /(thương mại|e-?commerce)/],
    ["business", /(quản trị|business|doanh)/],
    ["hotel|tourism", /(khách sạn|du lịch)/],
    ["mechatronics|electronics|automotive", /(kỹ thuật|cơ khí|điện|ô tô)/],
    ["logistics", /(logistics|chuỗi cung ứng)/]
  ];
  return pairs.some(([id, r]) => id.includes(majorId) && r.test(m)) ? 0.06 : 0;
}

export function computeScores(sub: Submission){
  const user = normalizeTraits(sub.traits);
  const results = (majors as Major[]).map(m => {
    const traitScore = m.traits.reduce((acc, v, i) => acc + v * user[i], 0) / m.traits.length; // 0..1
    const subjectScore = subjectAffinityMap(m.id, sub.scores, sub.favorites);
    const orient = orientationBoost(m.id, sub.orientation);
    // weights
    const score = traitScore * 0.6 + subjectScore * 0.34 + orient * 0.06;
    return { majorId: m.id, score };
  }).sort((a,b)=> b.score - a.score);

  const reasons = mockReasons(sub);
  return { id: sub.id, top: results.slice(0,3), reasons, submission: sub } as Result;
}

export function mockReasons(sub: Submission){
  const strong = Object.entries(sub.traits).sort((a,b)=> b[1]-a[1]).slice(0,2).map(([k])=>k);
  const fav = sub.favorites.join(", ");
  return `Vì sao phù hợp: Bạn mạnh về ${strong.join(" & ")}, cùng điểm mạnh ở các môn yêu thích (${fav}). Kết hợp định hướng "${sub.orientation}" nên các ngành Top phù hợp với bạn.`;
}

export function generateResultId(){
  return Math.random().toString(36).slice(2, 10);
}

export function encodeResultData(result: Result){
  const str = JSON.stringify(result);
  return btoa(unescape(encodeURIComponent(str)));
}
export function decodeResultData(param: string): Result | null {
  try{
    const json = decodeURIComponent(escape(atob(param)));
    return JSON.parse(json);
  }catch{
    return null;
  }
}

export function saveSubmission(result: Result){
  const key = `advisor_result_${result.id}`;
  localStorage.setItem(key, JSON.stringify(result));
  const listKey = "advisor_results_index";
  const idx = JSON.parse(localStorage.getItem(listKey) || "[]");
  const exists = idx.find((i: any)=> i.id === result.id);
  if(!exists){
    idx.unshift({ id: result.id, name: result.submission.name, createdAt: result.submission.createdAt, top: result.top });
    localStorage.setItem(listKey, JSON.stringify(idx));
  }
}

export function getSubmission(id: string): Result | null {
  const key = `advisor_result_${id}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) as Result : null;
}
