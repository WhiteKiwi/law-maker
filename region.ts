export type RegionJson = {
  name: string;
  regions: Region[];
}[];

export type Region = {
  id: string;
  시도: string;
  시군구: string;
  갑을병정무?: "갑" | "을" | "병" | "정" | "무";
};
