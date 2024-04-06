"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const filePath = path_1.default.join(__dirname, "../data/regions.json");
    const regionsJson = await (0, fs_extra_1.readJSON)(filePath);
    for (const regionData of regionsJson) {
        const regions = [];
        for (const region of regionData.regions) {
            let count = 0;
            const 시군구Arr = region.시군구.split("/");
            if (시군구Arr.length === 1) {
                regions.push(region);
                continue;
            }
            for (const 시군구 of 시군구Arr) {
                count++;
                regions.push({
                    ...region,
                    id: `${region.id}_${count}`,
                    시군구,
                });
                const candidatesDir = path_1.default.join(__dirname, `../data/candidates`);
                const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, region.id + ".json"));
                const regionId = `${region.id}_${count}`;
                await (0, fs_extra_1.writeJSON)(path_1.default.join(candidatesDir, `${region.id}_${count}.json`), candidates.map((c) => ({
                    ...c,
                    id: `${regionId}-${c.기호}`,
                    regionId,
                    공보PdfUrl: c.공보PdfUrl.replace(region.id, regionId),
                })), { spaces: 2 });
            }
        }
        regionData.regions = regions;
    }
    await (0, fs_extra_1.writeJSON)(filePath, regionsJson, { spaces: 2 });
}
main();
