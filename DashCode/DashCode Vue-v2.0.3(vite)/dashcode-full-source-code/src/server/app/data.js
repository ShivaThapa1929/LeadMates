import { faker } from "@faker-js/faker";
const date = new Date();
const prevDay = new Date().getDate() - 1;
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

// prettier-ignore
const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)
// prettier-ignore
const prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)
export const calendarEvents = [
  {
    title: "All Day Event",
    start: date,
    end: nextDay,
    allDay: false,
    //class: "warning",
    extendedProps: {
      calendar: "business",
    },
  },
  {
    title: "Meeting With Client",
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    //class: "success",
    extendedProps: {
      calendar: "personal",
    },
  },
  {
    title: "Lunch",
    allDay: true,
    start: new Date(date.getFullYear(), date.getMonth() + 1, -9),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -7),
    // class: "info",
    extendedProps: {
      calendar: "family",
    },
  },
  {
    title: "Birthday Party",
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    //class: "primary",
    extendedProps: {
      calendar: "meeting",
    },
  },
  {
    title: "Birthday Party",

    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    // class: "danger",
    extendedProps: {
      calendar: "holiday",
    },
  },
  {
    title: "Monthly Meeting",
    start: nextMonth,
    end: nextMonth,
    allDay: true,
    //class: "primary",
    extendedProps: {
      calendar: "business",
    },
  },
];
