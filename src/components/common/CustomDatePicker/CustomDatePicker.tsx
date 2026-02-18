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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toZonedTime } from "date-fns-tz";

type ViewMode = "day" | "month" | "year";

export function CustomDatePicker({
  className,
  allowClear = false,
  iconOnly = false,
  defaultValue,
  value,
  onChange,
  disableFutureDates = false,
  disablePastDates = false,
}: Readonly<{
  className?: string;
  allowClear?: boolean;
  iconOnly?: boolean;
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | null) => void;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
}>) {
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
  const [currentYear, setCurrentYear] = useState<number>(
    (value || defaultValue || new Date()).getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    (value || defaultValue || new Date()).getMonth()
  );

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

  const handleDateSelect = (selectedDate: Date | null) => {
    if (selectedDate) {
      // Crear una nueva fecha para evitar problemas de zona horaria
      const normalizedDate = toZonedTime(selectedDate, "UTC");

      setDate(normalizedDate);
      onChange?.(normalizedDate);
    } else {
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={iconOnly ? "ghost" : "outline"}
          data-empty={!date}
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
              {allowClear && date && (
                <Button variant="ghost" size="icon" onClick={() => setDate(null)}>
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
                // No modificar la fecha seleccionada, solo cambiar la vista
              }}
              disabled={(date) => {
                //Considerar la fecha justo a las 12:00:00
                const dateWithTime = toZonedTime(date, "UTC");
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
              }}
              footer
              components={{
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
              }}
            />
          </div>
        )}
        {viewMode === "month" && renderMonthView()}
        {viewMode === "year" && renderYearView()}
      </PopoverContent>
    </Popover>
  );
}
