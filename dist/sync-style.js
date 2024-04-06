"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    {
        const candidateDir = path_1.default.join(__dirname, "../data/candidates");
        const files = await (0, fs_extra_1.readdir)(candidateDir);
        for (const file of files) {
            const filePath = path_1.default.join(candidateDir, file);
            const candidates = await (0, fs_extra_1.readJSON)(filePath);
            for (const candidate of candidates) {
                (0, fs_extra_1.writeJsonSync)(path_1.default.join(__dirname, `../data/candidate-details/${candidate.id}.json`), candidate, { spaces: 2 });
            }
            (0, fs_extra_1.writeJsonSync)(filePath, candidates, { spaces: 2 });
        }
    }
    {
        const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
        const files = await (0, fs_extra_1.readdir)(lawMakerDir);
        for (const file of files) {
            const filePath = path_1.default.join(lawMakerDir, file);
            const lawMaker = await (0, fs_extra_1.readJSON)(filePath);
            (0, fs_extra_1.writeJsonSync)(filePath, lawMaker, { spaces: 2 });
        }
    }
}
main();
