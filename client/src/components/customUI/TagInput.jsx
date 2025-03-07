import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const TagInput = ({
  value = [],
  onChange,
  placeholder,
  maxTags = 10,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="h-6 select-none">
          {tag}
          <button
            type="button"
            className="ml-1 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
        placeholder={value.length === 0 ? placeholder : ""}
      />
    </div>
  );
};

export default TagInput;
