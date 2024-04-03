import { z } from "zod";

/**
 * @schema
 */
export type RegionsJson = 시도Region[];

/**
 * DO NOT MODIFY, AUTO GENERATED.
 * @codegen zod
 */
export const RegionsJson: z.Schema<RegionsJson> = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    regions: z.array(
      z.object({
        id: z.string(),
        시도: z.string(),
        시군구: z.string(),
        갑을병정무: z
          .union([
            z.literal("갑"),
            z.literal("을"),
            z.literal("병"),
            z.literal("정"),
            z.literal("무"),
          ])
          .optional(),
      })
    ),
  })
);

export type 시도Region = {
  id: string;
  name: string;
  regions: Region[];
};

export type Region = {
  id: string;
  시도: string;
  시군구: string;
  갑을병정무?: "갑" | "을" | "병" | "정" | "무";
};
