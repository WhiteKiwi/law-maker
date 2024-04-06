import { z } from "zod";

/**
 * @schema
 */
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
  대표법안목록: {
    // yyyy-MM-dd
    제안일: string;
    의안명: string;
    발의자: string;
    상임위원회: string;
    진행상황: string;
  }[];
  공약이행률:
    | {
        총공약수: number;
        공약이행수: number;
      }
    | null;
};

/**
 * DO NOT MODIFY, AUTO GENERATED.
 * @codegen zod
 */
export const LawMaker: z.Schema<LawMaker> = z.object({
  id: z.string(),
  이름: z.string(),
  정당: z.string(),
  당선횟수: z.number(),
  소속위원회: z.string(),
  주요경력: z.string(),
  연락처: z.string(),
  본회의_출석률: z.number(),
  본회의_출석률_등수: z.number(),
  상임위원회_출석률: z.array(
    z.object({
      위원회: z.string(),
      출석률: z.number(),
      등수: z.number(),
      총원: z.number(),
    })
  ),
  대표발의법안: z.number(),
  대표발의법안_등수: z.number(),
  위원회별_발의법안: z.array(
    z.object({
      위원회: z.string(),
      발의수: z.number(),
    })
  ),
  연도별_재산: z.array(
    z.object({
      연도: z.number(),
      재산: z.number(),
    })
  ),
  재산등수: z.number(),
  주요법안표결: z.array(
    z.object({
      별칭: z.string(),
      의안명: z.string(),
      의안번호: z.number(),
      찬반여부: z.union([
        z.literal("찬성"),
        z.literal("반대"),
        z.literal("기권"),
        z.literal("불참"),
      ]),
    })
  ),
  워드클라우드: z.array(
    z.object({
      단어: z.string(),
      count: z.string(),
    })
  ),
  대표법안목록: z.array(
    z.object({
      제안일: z.string(),
      의안명: z.string(),
      발의자: z.string(),
      상임위원회: z.string(),
      진행상황: z.string(),
    })
  ),
  공약이행률: z.object({
    총공약수: z.number(),
    공약이행수: z.number(),
  }).nullable(),
});
