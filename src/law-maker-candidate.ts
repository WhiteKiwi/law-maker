import { z } from "zod";

/**
 * @schema
 */
export type LawMakerCadidate = {
  id: string; // {region}-{no}
  id_21th?: string;
  regionId: string; // 지역
  imageUrl: string; // 이미지 url
  기호: number;
  이름: string;
  생년월일: string; // yyyyMMdd
  정당: string;
  성별: string;
  직업: string;
  학력: string;
  경력: string;
  재산: number; // 단위: 천원
  연도별_재산: {
    연도: number;
    재산: number; // 단위: 천원
  }[];
  군필여부: boolean;
  전과건수: number;
  전과ImgUrl: string;
};

/**
 * DO NOT MODIFY, AUTO GENERATED.
 * @codegen zod
 */
export const LawMakerCadidate: z.Schema<LawMakerCadidate> = z.object({
  id: z.string(),
  id_21th: z.string().optional(),
  regionId: z.string(),
  imageUrl: z.string(),
  기호: z.number(),
  이름: z.string(),
  생년월일: z.string(),
  정당: z.string(),
  성별: z.string(),
  직업: z.string(),
  학력: z.string(),
  경력: z.string(),
  재산: z.number(),
  연도별_재산: z.array(
    z.object({
      연도: z.number(),
      재산: z.number(),
    })
  ),
  군필여부: z.boolean(),
  전과건수: z.number(),
  전과ImgUrl: z.string(),
});
