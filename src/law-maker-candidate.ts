import { z } from "zod";
import { LawMaker } from "./law-maker";

/**
 * @schema
 */
export type LawMakerCadidate = {
  id: string; // {region}-{no}
  id_21th?: string;
  "21th"?: LawMaker;
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
  공보PdfUrl: string;
  공보ImgUrls: string[];
};

/**
 * DO NOT MODIFY, AUTO GENERATED.
 * @codegen zod
 */
export const LawMakerCadidate: z.Schema<LawMakerCadidate> = z.object({
  id: z.string(),
  id_21th: z.string().optional(),
  "21th": z
    .object({
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
      공약이행률: z.union([
        z.object({
          총공약수: z.number(),
          공약이행수: z.number(),
        }),
        z.literal(null),
      ]),
      공약이행률등수: z.union([z.number(), z.literal(null)]),
      공약이행수등수: z.union([z.number(), z.literal(null)]),
    })
    .optional(),
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
  공보PdfUrl: z.string(),
  공보ImgUrls: z.array(z.string()),
});
