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
      if (showOtherInput && otherValue) {
        // Nếu đang ẩn input và có giá trị, xóa nó khỏi values
        onChange(values.filter((v) => v !== otherValue));
        onOtherChange?.("");
      }
      return;
    }

    const exists = values.includes(opt);
    onChange(exists ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  const handleOtherInputChange = (inputValue: string) => {
    onOtherChange?.(inputValue);

    // Xóa giá trị cũ nếu có
    const filteredValues = values.filter((v) => v !== otherValue);

    // Thêm giá trị mới nếu không rỗng
    if (inputValue.trim()) {
      onChange([...filteredValues, inputValue.trim()]);
    } else {
      onChange(filteredValues);
    }
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
