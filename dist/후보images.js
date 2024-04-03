"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const candidatesDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidatesDir);
    for (const file of files) {
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        for (const candidate of candidates) {
            await saveImage(candidate);
            candidate.imageUrl = `https://raw.githubusercontent.com/WhiteKiwi/law-maker/main/data/images/candidates/${candidate.id}.jpg`;
        }
        await (0, fs_extra_1.writeJSON)(path_1.default.join(candidatesDir, file), candidates, { spaces: 2 });
    }
}
async function saveImage(candidate) {
    const response = await axios_1.default.get(candidate.imageUrl, {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "binary");
    await (0, fs_extra_1.writeFile)(path_1.default.join(__dirname, `../data/images/${candidate.id}.jpg`), buffer);
}
main();
