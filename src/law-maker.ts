export type LawMaker = {
  id: string;
  이름: string;
  정당: string;
  당선횟수: number;
  소속위원회: string;
  주요경력: string;
  연락처: string;

  본회의_출석률: number; // 백분율
  본회의_출석률_등수: number;
  상임위원회_출석률: {
    위원회: string;
    출석률: number; // 백분율
    등수: number;
    총원: number;
  }[];

  대표발의법안: number;
  대표발의법안_등수: number;
  위원회별_발의법안: {
    위원회: string;
    발의수: number;
  }[];

  연도별_재산: {
    연도: number;
    재산: number; // 단위: 천원
  }[];
  재산등수: number;
  주요법안표결: {
    별칭: string;
    의안명: string;
    의안번호: number;
    찬반여부: "찬성" | "반대" | "기권" | "불참";
  }[];

  워드클라우드: { 단어: string; count: string }[];
};
