import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const DatePickerWithRange = ({ className, input, setInput }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedRange) => {
    setInput((prev) => ({ ...prev, dateRange: selectedRange }));
    if (selectedRange?.from && selectedRange?.to) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !input.dateRange && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {input.dateRange?.from ? (
              input.dateRange.to ? (
                <>
                  {format(input.dateRange.from, "LLL dd, y")} -{" "}
                  {format(input.dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(input.dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={input.dateRange?.from}
            selected={input.dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
