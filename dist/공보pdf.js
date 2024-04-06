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
    console.log("files.length", files.length);
    for (const file of files) {
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        candidates.forEach((candidate) => {
            candidate.공보PdfUrl = `https://s3.whitekiwi.link/vote-for.kr/공보/${candidate.id}.pdf`;
        });
        await (0, fs_extra_1.writeJson)(path_1.default.join(candidatesDir, file), candidates, { spaces: 2 });
    }
}
async function savePdf(candidate) {
    const file = path_1.default.join(__dirname, `../vote-for.kr/공보/${candidate.id}.pdf`);
    if (await (0, fs_extra_1.exists)(file)) {
        return;
    }
    console.log("candidate.id", candidate.id);
    console.log("candidate.공보PdfUrl", candidate.공보PdfUrl);
    const response = await axios_1.default.get(candidate.공보PdfUrl, {
        responseType: "arraybuffer",
        headers: {
            Accept: "application/pdf",
        },
    });
    console.log("done");
    const buffer = Buffer.from(response.data, "binary");
    (0, fs_extra_1.writeFileSync)(file, buffer);
}
main();
