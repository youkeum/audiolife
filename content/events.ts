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
    imageUrl: "/posts/calendar/3.png",
    summary: "로이코 주관 하이파이 오디오쇼"
  },
    {
    id: "2026roycouadioshow",
    title: "2026 Royco Audio Show",
    date: "2026-04-04",
    imageUrl: "/posts/calendar/3.png",
    summary: "로이코 주관 하이파이 오디오쇼"
  },
    {
    id: "2026roycouadioshow",
    title: "2026 Royco Audio Show",
    date: "2026-04-05",
    imageUrl: "/posts/calendar/3.png",
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
  },
     {
    id: "koneav",
    title: "윌슨 XVX 크로노소닉 & 볼더 2110/2150 시연회",
    date: "2026-04-22",
    organizerName: "KONE AV",
    organizerUrl: "https://cafe.naver.com/samaudio/7389",
    imageUrl: "/posts/calendar/4.jpg",
    summary: "케이원에이브이 정기 시연회"
  },
  {
    id: "202604hfisaemenergy",
    title: "HFI 샘에너지 청음회",
    date: "2026-04-18",
    organizerName: "NAVER HFI COMMUNITY",
    organizerUrl: "https://cafe.naver.com/f-e/cafes/31297892/articles/4571?boardtype=L&referrerAllArticles=false",
    imageUrl: "",
    summary: "우마미 블랙 카트리지 국내 런칭회"
  },
   {
    id: "202605sohgom",
    title: "소곰 JBL 마칼루 청음회",
    date: "2026-05-02",
    organizerName: "SOHGOM",
    organizerUrl: "https://cafe.naver.com/f-e/cafes/30169838/articles/39333?boardtype=L&referrerAllArticles=false",
    imageUrl: "/posts/calendar/5.jpg",
    summary: "JBL 마칼루 & VAC 마스터 프리/파워 앰프 청음회"
  },
  {
    id: "202605royco",
    title: "로이코 제34회 정기 시청회",
    date: "2026-05-28",
    organizerName: "Royco",
    organizerUrl: "",
    imageUrl: "/posts/calendar/6.jpg",
    summary: "매킨토시 MCD12000을 통한 CD 청음회"
  },
];
