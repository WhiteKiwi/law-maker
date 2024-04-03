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
    let count = 0;
    for (const file of files) {
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        for (const candidate of candidates) {
            console.log(++count);
            if (!candidate.전과ImgUrl) {
                console.log("no pdf url!!!!!!!!!!", candidate.id);
                continue;
            }
            candidate.전과ImgUrl = `https://raw.githubusercontent.com/WhiteKiwi/law-maker/main/data/images/jeon-gwa/${candidate.id}.jpg`;
        }
        await (0, fs_extra_1.writeJSON)(path_1.default.join(candidatesDir, file), candidates, { spaces: 2 });
    }
}
async function saveImage(candidate) {
    const response = await axios_1.default.get(candidate.전과ImgUrl, {
        responseType: "arraybuffer",
        headers: {
            Accept: "application/pdf",
        },
    });
    console.log("candidate.id", candidate.id);
    const buffer = Buffer.from(response.data, "binary");
    const file = path_1.default.join(__dirname, `../data/tmp/${candidate.id}.pdf`);
    (0, fs_extra_1.writeFileSync)(file, buffer);
}
main();
