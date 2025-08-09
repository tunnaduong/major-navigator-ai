import { Progress } from "@/components/ui/progress";

export function Stepper({ step, total }:{ step:number; total:number }){
  const pct = Math.round(((step+1)/total)*100);
  return (
    <div className="flex items-center gap-3">
      <Progress value={pct} className="h-2 w-full" />
      <span className="text-sm text-muted-foreground min-w-16 text-right">{pct}%</span>
    </div>
  );
}
