import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function TagSelect({
  options,
  values,
  onChange,
  allowOther = false,
  otherValue = "",
  onOtherChange,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}) {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const toggle = (opt: string) => {
    if (opt === "Khác") {
      setShowOtherInput(!showOtherInput);
      if (showOtherInput) {
        // Khi ẩn input, xóa custom value và chỉ giữ lại các options gốc
        const filteredValues = values.filter((v) => options.includes(v));
        onChange(filteredValues);
        onOtherChange?.("");
      }
      return;
    }

    const exists = values.includes(opt);
    onChange(exists ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  const handleOtherInputChange = (inputValue: string) => {
    onOtherChange?.(inputValue);

    // Xóa các giá trị custom cũ khỏi values để tránh trùng lặp
    // Chỉ giữ lại các giá trị từ options gốc
    const filteredValues = values.filter((v) => options.includes(v));
    onChange(filteredValues);
  };

  const isOtherSelected = showOtherInput && otherValue.trim() !== "";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => toggle(o)}
            className="focus:outline-none"
          >
            <Badge variant={values.includes(o) ? "default" : "secondary"}>
              {o}
            </Badge>
          </button>
        ))}
        {allowOther && (
          <button onClick={() => toggle("Khác")} className="focus:outline-none">
            <Badge variant={isOtherSelected ? "default" : "secondary"}>
              Khác
            </Badge>
          </button>
        )}
      </div>

      {allowOther && showOtherInput && (
        <div className="mt-2">
          <Input
            placeholder="Nhập sở thích khác..."
            value={otherValue}
            onChange={(e) => handleOtherInputChange(e.target.value)}
            className="max-w-xs"
          />
        </div>
      )}
    </div>
  );
}
