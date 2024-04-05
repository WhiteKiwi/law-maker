export type RankItemCommon = {
  id: string;
  imageUrl?: string;
  이름: string;
  지역구?: string;
  정당: string;
};

// /data/ranking/money.json
export type 재산RankItem = {
  rank: number;
  재산: number; // 단위: 천원
  총원: number;
} & RankItemCommon;

// /data/ranking/money-increase.json
export type 재산증가율RankItem = {
  rank: number;
  재산증가율: number; // 단위: %
  재산증가량: number; // 단위: 천원
  총원: number;
} & RankItemCommon;

// /data/ranking/attendance.json
export type 본회의출석률RankItem = {
  rank: number;
  본회의출석률: number; // 단위: %
  총원: number;
} & RankItemCommon;

// /data/ranking/initiative.json
export type 대표발의법안RankItem = {
  rank: number;
  대표발의법안: number;
  총원: number;
} & RankItemCommon;
