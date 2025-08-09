import { Badge } from "@/components/ui/badge";

export function TagSelect({ options, values, onChange }:{ options:string[]; values:string[]; onChange:(v:string[])=>void }){
  const toggle = (opt:string) => {
    const exists = values.includes(opt);
    onChange(exists ? values.filter(v=>v!==opt) : [...values, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o)=> (
        <button key={o} onClick={()=>toggle(o)} className="focus:outline-none">
          <Badge variant={values.includes(o)?"default":"secondary"}>{o}</Badge>
        </button>
      ))}
    </div>
  );
}
