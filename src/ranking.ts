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

// /data/ranking/promise-count.json
export type 공약이행수RankItem = {
  rank: number;
  공약이행수: number | null; // null은 제공안한넘
  총원: number;
} & RankItemCommon;

// /data/ranking/promise-rate.json
export type 공약이행률RankItem = {
  rank: number;
  공약이행률: number | null; // 단위: %, null은 제공안한넘
  총원: number;
} & RankItemCommon;
