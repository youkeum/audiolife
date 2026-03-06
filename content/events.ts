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
  },
    {
    id: "2026roycouadioshow",
    title: "2026 Royco Audio Show",
    date: "2026-04-03",
    imageUrl: "",
    summary: "로이코 주관 하이파이 오디오쇼"
  },
    {
    id: "2026roycouadioshow",
    title: "2026 Royco Audio Show",
    date: "2026-04-04",
    imageUrl: "",
    summary: "로이코 주관 하이파이 오디오쇼"
  },
    {
    id: "2026roycouadioshow",
    title: "2026 Royco Audio Show",
    date: "2026-04-05",
    imageUrl: "",
    summary: "로이코 주관 하이파이 오디오쇼"
  },
   {
    id: "202603hfisorishop",
    title: "HFI 소리샵 청음회",
    date: "2026-03-14",
    organizerName: "NAVER HFI COMMUNITY",
    organizerUrl: "https://naver.me/F1az6Cki",
    imageUrl: "",
    summary: "오디오벡터 & T+A 청음회"
  },
     {
    id: "pinkfaun",
    title: "아날로그라운지 Pink Faun CEO 내한 청음회",
    date: "2026-03-07",
    organizerName: "Analog Lounge",
    organizerUrl: "https://cafe.naver.com/hfi/4319",
    imageUrl: "",
    summary: "Pink Faun CEO 내한 청음회"
  },
   {
    id: "pinkfaun",
    title: "아날로그라운지 Pink Faun CEO 내한 청음회",
    date: "2026-03-08",
    organizerName: "Analog Lounge",
    organizerUrl: "https://cafe.naver.com/hfi/4319",
    imageUrl: "",
    summary: "Pink Faun CEO 내한 청음회"
  }
];
