"use client";

import { useEffect, useMemo, useState } from "react";
import type { AudioEvent } from "@/content/events";

type EventCalendarProps = {
  events: AudioEvent[];
};

type DayCell = {
  key: string;
  dayNumber: number;
  dateString: string;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthCells(year: number, monthIndex: number): DayCell[] {
  const monthStart = new Date(year, monthIndex, 1);
  const firstWeekday = monthStart.getDay();
  const gridStart = new Date(year, monthIndex, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      key: toDateString(date),
      dayNumber: date.getDate(),
      dateString: toDateString(date),
      inCurrentMonth: date.getMonth() === monthIndex
    };
  });
}

function getInitialMonth(events: AudioEvent[]): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [cursor, setCursor] = useState<Date>(() => getInitialMonth(events));
  const [selected, setSelected] = useState<AudioEvent | null>(null);

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const monthLabel = `${year}년 ${monthIndex + 1}월`;
  const organizerUrl = selected?.organizerUrl?.trim() ?? "";
  const organizerName = selected?.organizerName?.trim() ?? "";

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AudioEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  const monthCells = useMemo(() => getMonthCells(year, monthIndex), [year, monthIndex]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section className="event-calendar-wrap" aria-label="오디오 행사 캘린더">
      <div className="event-calendar-head">
        <h2>오디오 행사 캘린더</h2>
      </div>

      <div className="event-calendar">
        <div className="event-calendar-toolbar">
          <button type="button" onClick={() => setCursor(new Date(year, monthIndex - 1, 1))} aria-label="이전 달">
            ‹
          </button>
          <strong>{monthLabel}</strong>
          <button type="button" onClick={() => setCursor(new Date(year, monthIndex + 1, 1))} aria-label="다음 달">
            ›
          </button>
        </div>

        <div className="event-weekdays">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="event-grid">
          {monthCells.map((cell) => {
            const cellEvents = eventsByDate.get(cell.dateString) ?? [];

            return (
              <div key={cell.key} className={`event-cell ${cell.inCurrentMonth ? "in-month" : "out-month"}`}>
                <div className="event-day">{cell.dayNumber}</div>
                <div className="event-items">
                  {cellEvents.map((eventItem) => (
                    <button
                      key={`${eventItem.id}-${eventItem.date}`}
                      type="button"
                      className="event-pill"
                      onClick={() => setSelected(eventItem)}
                    >
                      {eventItem.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected ? (
        <div className="event-modal-backdrop" onClick={() => setSelected(null)} role="presentation">
          <article className="event-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="event-modal-close" onClick={() => setSelected(null)} aria-label="닫기">
              ×
            </button>
            <h3>{selected.title}</h3>
            <p className="event-modal-date">{selected.date}</p>
            {selected.summary ? <p className="event-modal-summary">{selected.summary}</p> : null}
            {organizerUrl ? (
              <a href={organizerUrl} target="_blank" rel="noreferrer" className="event-modal-link">
                {organizerName ? `${organizerName} 링크 열기` : "링크 열기"}
              </a>
            ) : null}
            <img src={selected.imageUrl} alt={selected.title} className="event-modal-image" />
          </article>
        </div>
      ) : null}
    </section>
  );
}
