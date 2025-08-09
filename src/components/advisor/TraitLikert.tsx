import { Slider } from "@/components/ui/slider";

export function TraitLikert({ label, value, onChange }:{ label:string; value:number; onChange:(v:number)=>void }){
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 text-sm">{label}</div>
      <div className="flex-1">
        <Slider value={[value]} min={1} max={5} step={1} onValueChange={(v)=>onChange(v[0])} />
      </div>
      <div className="w-10 text-right text-sm text-muted-foreground">{value}</div>
    </div>
  );
}
