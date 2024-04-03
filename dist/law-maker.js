"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawMaker = void 0;
const zod_1 = require("zod");
exports.LawMaker = zod_1.z.object({
    id: zod_1.z.string(),
    이름: zod_1.z.string(),
    정당: zod_1.z.string(),
    당선횟수: zod_1.z.number(),
    소속위원회: zod_1.z.string(),
    주요경력: zod_1.z.string(),
    연락처: zod_1.z.string(),
    본회의_출석률: zod_1.z.number(),
    본회의_출석률_등수: zod_1.z.number(),
    상임위원회_출석률: zod_1.z.array(zod_1.z.object({
        위원회: zod_1.z.string(),
        출석률: zod_1.z.number(),
        등수: zod_1.z.number(),
        총원: zod_1.z.number(),
    })),
    대표발의법안: zod_1.z.number(),
    대표발의법안_등수: zod_1.z.number(),
    위원회별_발의법안: zod_1.z.array(zod_1.z.object({
        위원회: zod_1.z.string(),
        발의수: zod_1.z.number(),
    })),
    연도별_재산: zod_1.z.array(zod_1.z.object({
        연도: zod_1.z.number(),
        재산: zod_1.z.number(),
    })),
    재산등수: zod_1.z.number(),
    주요법안표결: zod_1.z.array(zod_1.z.object({
        별칭: zod_1.z.string(),
        의안명: zod_1.z.string(),
        의안번호: zod_1.z.number(),
        찬반여부: zod_1.z.union([
            zod_1.z.literal("찬성"),
            zod_1.z.literal("반대"),
            zod_1.z.literal("기권"),
            zod_1.z.literal("불참"),
        ]),
    })),
    워드클라우드: zod_1.z.array(zod_1.z.object({
        단어: zod_1.z.string(),
        count: zod_1.z.string(),
    })),
});
