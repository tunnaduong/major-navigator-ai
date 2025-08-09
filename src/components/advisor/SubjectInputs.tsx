import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SubjectInputs({ scores, onChange }:{ scores: { [k:string]: number }; onChange:(k:string,v:number)=>void }){
  const fields = [
    ["math","Toán"], ["literature","Văn"], ["english","Anh"], ["informatics","Tin"], ["physics","Vật lý"], ["chemistry","Hóa"]
  ] as const;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {fields.map(([k, label])=> (
        <div key={k} className="space-y-2">
          <Label htmlFor={k}>{label} (0–10)</Label>
          <Input id={k} type="number" inputMode="decimal" min={0} max={10} value={scores[k] ?? 0} onChange={(e)=>onChange(k, Math.max(0, Math.min(10, Number(e.target.value))))} />
        </div>
      ))}
    </div>
  );
}
