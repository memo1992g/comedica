import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import "./calendar.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp-calendar", className)}
      classNames={{
        months: "rdp-months",
        month: "rdp-month",
        month_caption: "rdp-month_caption",
        caption_label: "rdp-caption_label",
        nav: "rdp-nav",
        button_previous: "rdp-button_previous",
        button_next: "rdp-button_next",
        weeks: "rdp-weeks",
        weekdays: "rdp-weekdays",
        weekday: "rdp-weekday",
        week: "rdp-week",
        day: "rdp-day",
        day_button: "rdp-day_button",
        today: "rdp-today",
        selected: "rdp-selected",
        outside: "rdp-outside",
        disabled: "rdp-disabled",
        hidden: "rdp-hidden",
        range_start: "rdp-range_start",
        range_middle: "rdp-range_middle",
        range_end: "rdp-range_end",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
