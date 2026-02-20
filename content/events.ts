export type AudioEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  organizerName?: string;
  organizerUrl?: string;
  imageUrl: string;
  summary?: string;
};

// 새 일정은 아래 배열에 같은 형식으로 한 줄씩 추가하면 됩니다.
export const audioEvents: AudioEvent[] = [
  {
    id: "202602hfiroyco",
    title: "HFI 로이코 청음회",
    date: "2026-02-28",
    organizerName: "NAVER HFI COMMUNITY",
    organizerUrl: "https://cafe.naver.com/hfi/4240",
    imageUrl: "/posts/calendar/1.png",
    summary: "TAOC 랙 및 아날로그 청음회"
  },
   {
    id: "2026recorddays",
    title: "RECORD DAYS in SEOUL",
    date: "2026-02-21",
    imageUrl: "/posts/calendar/2.png",
    summary: "VINYL 및 K-AUDIO 청음 행사"
  },
     {
    id: "2026recorddays",
    title: "RECORD DAYS in SEOUL",
    date: "2026-02-22",
    imageUrl: "/posts/calendar/2.png",
    summary: "VINYL 및 K-AUDIO 청음 행사"
  },
     {
    id: "2026recorddays",
    title: "RECORD DAYS in SEOUL",
    date: "2026-03-28",
    imageUrl: "/posts/calendar/2.png",
    summary: "VINYL 및 K-AUDIO 청음 행사"
  },
     {
    id: "2026recorddays",
    title: "RECORD DAYS in SEOUL",
    date: "2026-03-29",
    imageUrl: "/posts/calendar/2.png",
    summary: "VINYL 및 K-AUDIO 청음 행사"
  }
];
