import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { Traits } from "@/utils/scoring";

export function TraitBarChart({ traits }:{ traits: Traits }){
  const data = Object.entries(traits).map(([k,v])=> ({ name: labelMap[k as keyof Traits], value: v }));
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[1,5]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--accent))" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const labelMap: Record<keyof Traits, string> = {
  logic: "Logic",
  creativity: "Sáng tạo",
  communication: "Giao tiếp",
  meticulous: "Tỉ mỉ",
  leadership: "Lãnh đạo",
  patience: "Kiên nhẫn"
};
