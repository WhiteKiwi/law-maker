export type LawMakerCadidate = {
  id: string; // {region}-{no}
  regionId: string; // 지역
  no: number; // 기호
  name: string; // 이름
  party: string; // 정당
  imageUrl: string; // 이미지 url
};

export type LawMaker = {
  id: string; // {region}-{no}
  regionId: string; // 지역
  no: number; // 기호
  name: string; // 이름
  party: string; // 정당
  imageUrl: string; // 이미지 url
};
