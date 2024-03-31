export type LawMakerCadidate = {
  id: string; // {region}-{no}
  id_21th?: string;
  regionId: string; // 지역
  imageUrl: string; // 이미지 url
  기호: number;
  이름: string;
  정당: string;
  성별: string;
  직업: string;
  학력: string;
  경력: string;
  재산: number; // 단위: 천원
  군필여부: boolean;
  전과건수: number;
};
