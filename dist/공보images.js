"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const images = await (0, fs_extra_1.readdir)(path_1.default.join(__dirname, "../vote-for.kr/공보/images"));
    const candidateDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidateDir);
    for (const file of files) {
        const filePath = path_1.default.join(candidateDir, file);
        const candidates = await (0, fs_extra_1.readJSON)(filePath);
        for (const candidate of candidates) {
            candidate.공보ImgUrls = images
                .filter((image) => {
                const regex = new RegExp(candidate.id + "-\\d*.jpg");
                return regex.test(image) || image === `${candidate.id}.jpg`;
            })
                .map((image) => `https://s3.whitekiwi.link/vote-for.kr/공보/images/${image}`);
        }
        (0, fs_extra_1.writeJsonSync)(filePath, candidates, { spaces: 2 });
    }
}
main();
