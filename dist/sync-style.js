"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const lawMakers = [];
    {
        const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
        const files = await (0, fs_extra_1.readdir)(lawMakerDir);
        for (const file of files) {
            const filePath = path_1.default.join(lawMakerDir, file);
            const lawMaker = await (0, fs_extra_1.readJSON)(filePath);
            if (lawMaker.공약이행률등수 === undefined) {
                lawMaker.공약이행률등수 = null;
            }
            if (lawMaker.공약이행수등수 === undefined) {
                lawMaker.공약이행수등수 = null;
            }
            const 의안번호정렬 = [
                2122268, 2102500, 2120877, 2107249, 2121515, 2123038, 2125809, 2119727,
                2119142, 2126369, 2125837, 2120933,
            ];
            lawMaker.주요법안표결.sort((a, b) => 의안번호정렬.indexOf(a.의안번호) - 의안번호정렬.indexOf(b.의안번호));
            (0, fs_extra_1.writeJsonSync)(filePath, lawMaker, { spaces: 2 });
            lawMakers.push(lawMaker);
        }
    }
    {
        const candidateDir = path_1.default.join(__dirname, "../data/candidates");
        const files = await (0, fs_extra_1.readdir)(candidateDir);
        for (const file of files) {
            const filePath = path_1.default.join(candidateDir, file);
            const candidates = await (0, fs_extra_1.readJSON)(filePath);
            for (const candidate of candidates) {
                if (candidate.id_21th) {
                    candidate["21th"] = lawMakers.find((lawMaker) => lawMaker.id === candidate.id_21th);
                }
            }
            for (const candidate of candidates) {
                (0, fs_extra_1.writeJsonSync)(path_1.default.join(__dirname, `../data/candidate-details/${candidate.id}.json`), candidate, { spaces: 2 });
            }
            (0, fs_extra_1.writeJsonSync)(filePath, candidates, { spaces: 2 });
        }
    }
}
main();
