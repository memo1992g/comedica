"use client";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";
import type { DateRange } from "react-day-picker";

type ViewMode = "day" | "month" | "year";
type SelectionMode = "single" | "range";

export function CustomDatePicker({
  className,
  allowClear = false,
  iconOnly = false,
  selectionMode = "single",
  defaultValue,
  value,
  defaultRangeValue,
  rangeValue,
  onChange,
  onRangeChange,
  disableFutureDates = false,
  disablePastDates = false,
}: Readonly<{
  className?: string;
  allowClear?: boolean;
  iconOnly?: boolean;
  selectionMode?: SelectionMode;
  defaultValue?: Date;
  value?: Date;
  defaultRangeValue?: DateRange;
  rangeValue?: DateRange;
  onChange?: (date: Date | null) => void;
  onRangeChange?: (range: DateRange | undefined) => void;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | undefined>(undefined);
  const [date, setDate] = useState<Date | null>(() => {
    if (value) {
      return toZonedTime(value, "UTC");
    }
    if (defaultValue) {
      return toZonedTime(defaultValue, "UTC");
    }
    return null;
  });
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (rangeValue) {
      return {
        from: rangeValue.from ? toZonedTime(rangeValue.from, "UTC") : undefined,
        to: rangeValue.to ? toZonedTime(rangeValue.to, "UTC") : undefined,
      };
    }

    if (defaultRangeValue) {
      return {
        from: defaultRangeValue.from
          ? toZonedTime(defaultRangeValue.from, "UTC")
          : undefined,
        to: defaultRangeValue.to ? toZonedTime(defaultRangeValue.to, "UTC") : undefined,
      };
    }

    return undefined;
  });
  const [currentYear, setCurrentYear] = useState<number>(
    (value || defaultValue || new Date()).getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    (value || defaultValue || new Date()).getMonth()
  );

  // Prefer internal range state so user clicks update the display immediately,
  // even before the parent re-renders with a new rangeValue.
  const effectiveRange = range ?? rangeValue;

  // Keep internal range in sync when rangeValue is changed externally.
  useEffect(() => {
    if (rangeValue === undefined) return;
    setRange({
      from: rangeValue.from ? toZonedTime(rangeValue.from, "UTC") : undefined,
      to: rangeValue.to ? toZonedTime(rangeValue.to, "UTC") : undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeValue?.from?.getTime(), rangeValue?.to?.getTime()]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getAnchorDate = () => {
    if (selectionMode === "range") {
      const activeRange = effectiveRange;
      if (activeRange?.from) {
        return toZonedTime(activeRange.from, "UTC");
      }
    }

    if (value) {
      return toZonedTime(value, "UTC");
    }

    if (date) {
      return date;
    }

    if (defaultValue) {
      return toZonedTime(defaultValue, "UTC");
    }

    if (defaultRangeValue?.from) {
      return toZonedTime(defaultRangeValue.from, "UTC");
    }

    return new Date();
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    if (selectedDate) {
      // Crear una nueva fecha para evitar problemas de zona horaria
      const normalizedDate = toZonedTime(selectedDate, "UTC");

      setDate(normalizedDate);
      onChange?.(normalizedDate);
      setIsOpen(false);
    } else {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  const handleRangeSelect = (
    selectedRange: DateRange | undefined,
    selectedDay?: Date
  ) => {
    const activeRange = effectiveRange;
    const hasCompletedRange = Boolean(activeRange?.from && activeRange?.to);
    const isSingleDaySelection = Boolean(
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from.getTime() === selectedRange.to?.getTime()
    );

    if (hasCompletedRange && selectedDay) {
      const restartRange: DateRange = {
        from: toZonedTime(selectedDay, "UTC"),
        to: undefined,
      };

      setRange(restartRange);
      onRangeChange?.(restartRange);
      setHoverDate(undefined);
      setIsOpen(true);
      return;
    }

    if (hasCompletedRange && isSingleDaySelection && selectedRange?.from) {
      const restartRange: DateRange = {
        from: toZonedTime(selectedRange.from, "UTC"),
        to: undefined,
      };

      setRange(restartRange);
      onRangeChange?.(restartRange);
      setHoverDate(undefined);
      setIsOpen(true);
      return;
    }

    const isFirstClickSameDayRange =
      !activeRange?.from &&
      !activeRange?.to &&
      selectedRange?.from &&
      selectedRange?.to &&
      selectedRange.from.getTime() === selectedRange?.to.getTime();

    if (isFirstClickSameDayRange) {
      const partialRange: DateRange = {
        from: toZonedTime(selectedRange.from!, "UTC"),
        to: undefined,
      };

      setRange(partialRange);
      onRangeChange?.(partialRange);
      setHoverDate(undefined);
      setIsOpen(true);
      return;
    }

    const normalizedRange = selectedRange
      ? {
          from: selectedRange.from
            ? toZonedTime(selectedRange.from, "UTC")
            : undefined,
          to: selectedRange.to ? toZonedTime(selectedRange.to, "UTC") : undefined,
        }
      : undefined;

    setRange(normalizedRange);
    onRangeChange?.(normalizedRange);
    setHoverDate(undefined);

    if (normalizedRange?.from && !normalizedRange?.to) {
      setIsOpen(true);
      return;
    }

    if (normalizedRange?.from && normalizedRange?.to) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  };

  const getPreviewRange = () => {
    const activeRange = effectiveRange;

    if (!activeRange?.from) {
      return activeRange;
    }

    if (activeRange.to) {
      return activeRange;
    }

    if (!hoverDate) {
      return activeRange;
    }

    if (hoverDate.getTime() >= activeRange.from.getTime()) {
      return {
        from: activeRange.from,
        to: hoverDate,
      };
    }

    return {
      from: hoverDate,
      to: activeRange.from,
    };
  };

  const previewRange = getPreviewRange();

  const isPreviewDay = (day: Date) => {
    if (!previewRange?.from || !previewRange?.to) {
      return false;
    }

    const dayDate = toZonedTime(day, "UTC");
    dayDate.setHours(0, 0, 0, 0);

    const fromDate = toZonedTime(previewRange.from, "UTC");
    fromDate.setHours(0, 0, 0, 0);

    const toDate = toZonedTime(previewRange.to, "UTC");
    toDate.setHours(0, 0, 0, 0);

    return dayDate >= fromDate && dayDate <= toDate;
  };

  const goToToday = () => {
    const today = new Date();
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (selectionMode === "range") {
      const todayRange: DateRange = {
        from: normalizedToday,
        to: normalizedToday,
      };
      setRange(todayRange);
      setCurrentYear(normalizedToday.getFullYear());
      setCurrentMonth(normalizedToday.getMonth());
      onRangeChange?.(todayRange);
      return;
    }

    setDate(normalizedToday);
    setCurrentYear(normalizedToday.getFullYear());
    setCurrentMonth(normalizedToday.getMonth());
    onChange?.(normalizedToday);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setViewMode("day");
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode("month");
  };

  const renderMonthView = () => (
    <div className="p-3 dark:bg-black">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("day")}
          className="h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("year")}
          className="h-8 px-2 font-medium text-sm"
        >
          {currentYear}
        </Button>
        <div className="w-8" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant="ghost"
            size="sm"
            onClick={() => handleMonthSelect(index)}
            className={cn(
              "h-8",
              date?.getMonth() === index &&
                date.getFullYear() === currentYear
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {month.substring(0, 3)}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderYearView = () => {
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="p-3 dark:bg-black">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentYear((prev) => prev - 10)}
            className="h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm">
            {startYear} - {startYear + 9}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentYear((prev) => prev + 10)}
            className="h-8 px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant="ghost"
              size="sm"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "h-8 text-xs",
                currentYear === year
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const getDisplayText = () => {
    if (selectionMode === "range") {
      const selectedRange = effectiveRange;

      if (!selectedRange?.from && !selectedRange?.to) {
        return "Selecciona rango";
      }

      if (selectedRange?.from && !selectedRange?.to) {
        return `${format(selectedRange.from, "dd/MM/yyyy")} - ...`;
      }

      if (selectedRange?.from && selectedRange?.to) {
        return `${format(selectedRange.from, "dd/MM/yyyy")} - ${format(
          selectedRange.to,
          "dd/MM/yyyy"
        )}`;
      }

      return "Selecciona rango";
    }

    if (!date) return "Selecciona una fecha";

    switch (viewMode) {
      case "month":
        return format(date, "MMMM yyyy");
      case "year":
        return format(date, "yyyy");
      default:
        return format(date, "dd/MM/yyyy");
    }
  };

    const isDateDisabled = (calendarDate: Date) => {
      const dateWithTime = toZonedTime(calendarDate, "UTC");
      dateWithTime.setHours(0, 0, 0, 0);
      const todayWithTime = toZonedTime(new Date(), "UTC");
      todayWithTime.setHours(0, 0, 0, 0);

      if (disableFutureDates) {
        return dateWithTime > todayWithTime;
      }

      if (disablePastDates) {
        return dateWithTime < todayWithTime;
      }

      return false;
    };

    const calendarComponents = {
      Footer: () => (
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex flex-col w-full items-end justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToToday}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Hoy
            </Button>
          </div>
        </div>
      ),
      MonthCaption: () => (
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newMonth = currentMonth - 1;
                if (newMonth < 0) {
                  setCurrentMonth(11);
                  setCurrentYear((prev) => prev - 1);
                } else {
                  setCurrentMonth(newMonth);
                }
              }}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-8 px-1 font-medium text-sm"
            >
              {months[currentMonth]}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("year")}
              className="h-8 px-1 font-medium text-sm"
            >
              {currentYear}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newMonth = currentMonth + 1;
              if (newMonth > 11) {
                setCurrentMonth(0);
                setCurrentYear((prev) => prev + 1);
              } else {
                setCurrentMonth(newMonth);
              }
            }}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);

        if (open) {
          const anchorDate = getAnchorDate();
          setCurrentYear(anchorDate.getFullYear());
          setCurrentMonth(anchorDate.getMonth());
        }

        if (!open) {
          setHoverDate(undefined);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "outline"}
          data-empty={
            selectionMode === "range"
              ? !effectiveRange?.from && !effectiveRange?.to
              : !date
          }
          type="button"
          aria-label={iconOnly ? "Seleccionar fecha" : undefined}
          className={cn(
            iconOnly
              ? "justify-center p-0"
              : "data-[empty=true]:text-muted-foreground justify-start text-left font-normal leading-4 text-wrap w-full pr-1",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {!iconOnly && (
            <div className="flex w-full justify-between items-center">
              <span className="text-wrap leading-4">{getDisplayText()}</span>
              {allowClear &&
                ((selectionMode === "single" && date) ||
                  (selectionMode === "range" && (effectiveRange?.from || effectiveRange?.to))) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (selectionMode === "range") {
                      setRange(undefined);
                      onRangeChange?.(undefined);
                      return;
                    }

                    setDate(null);
                    onChange?.(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {viewMode === "day" && (
          <div>
            {/* Header personalizado */}
            {selectionMode === "range" ? (
              <Calendar
                mode="range"
                timeZone="UTC"
                selected={effectiveRange}
                onSelect={handleRangeSelect}
                onDayMouseEnter={(day) => {
                  if (!effectiveRange?.from || effectiveRange?.to) return;
                  setHoverDate(toZonedTime(day, "UTC"));
                }}
                onDayMouseLeave={() => {
                  if (effectiveRange?.to) return;
                  setHoverDate(undefined);
                }}
                hideNavigation
                month={new Date(currentYear, currentMonth)}
                onMonthChange={(newMonth) => {
                  setCurrentMonth(newMonth.getMonth());
                  setCurrentYear(newMonth.getFullYear());
                }}
                disabled={isDateDisabled}
                modifiers={{
                  preview_range: isPreviewDay,
                }}
                modifiersClassNames={{
                  preview_range: "rdp-preview_range",
                }}
                footer
                components={calendarComponents}
              />
            ) : (
              <Calendar
                mode="single"
                timeZone="UTC"
                selected={value || date || undefined}
                onSelect={handleDateSelect}
                required
                hideNavigation
                month={new Date(currentYear, currentMonth)}
                onMonthChange={(newMonth) => {
                  setCurrentMonth(newMonth.getMonth());
                  setCurrentYear(newMonth.getFullYear());
                }}
                disabled={isDateDisabled}
                footer
                components={calendarComponents}
              />
            )}
          </div>
        )}
        {viewMode === "month" && renderMonthView()}
        {viewMode === "year" && renderYearView()}
      </PopoverContent>
    </Popover>
  );
}
