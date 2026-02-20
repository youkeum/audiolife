import type { Metadata } from "next";
import EventCalendar from "@/components/EventCalendar";
import { audioEvents } from "@/content/events";

export const metadata: Metadata = {
  title: "Calendar",
  description: "오디오 행사 일정 캘린더"
};

export default function CalendarPage() {
  return (
    <>
      <EventCalendar events={audioEvents} />
    </>
  );
}
