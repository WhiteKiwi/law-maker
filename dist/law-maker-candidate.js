"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawMakerCadidate = void 0;
const zod_1 = require("zod");
exports.LawMakerCadidate = zod_1.z.object({
    id: zod_1.z.string(),
    id_21th: zod_1.z.string().optional(),
    regionId: zod_1.z.string(),
    imageUrl: zod_1.z.string(),
    기호: zod_1.z.number(),
    이름: zod_1.z.string(),
    생년월일: zod_1.z.string(),
    정당: zod_1.z.string(),
    성별: zod_1.z.string(),
    직업: zod_1.z.string(),
    학력: zod_1.z.string(),
    경력: zod_1.z.string(),
    재산: zod_1.z.number(),
    연도별_재산: zod_1.z.array(zod_1.z.object({
        연도: zod_1.z.number(),
        재산: zod_1.z.number(),
    })),
    군필여부: zod_1.z.boolean(),
    전과건수: zod_1.z.number(),
    전과ImgUrl: zod_1.z.string(),
    공보PdfUrl: zod_1.z.string(),
});
