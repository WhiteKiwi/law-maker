"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionsJson = void 0;
const zod_1 = require("zod");
exports.RegionsJson = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    regions: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        시도: zod_1.z.string(),
        시군구: zod_1.z.string(),
        갑을병정무: zod_1.z
            .union([
            zod_1.z.literal("갑"),
            zod_1.z.literal("을"),
            zod_1.z.literal("병"),
            zod_1.z.literal("정"),
            zod_1.z.literal("무"),
        ])
            .optional(),
    })),
}));
