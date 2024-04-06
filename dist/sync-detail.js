"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    const candidates = await loadCandidates();
    for (const candidate of candidates) {
        console.log("candidate", candidate);
        (0, fs_extra_1.writeJsonSync)(path_1.default.join(__dirname, `../data/candidate-details/${candidate.id}.json`), candidate, { spaces: 2 });
    }
}
async function loadCandidates() {
    const candidates = [];
    const candidateDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidateDir);
    for (const file of files) {
        const _candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidateDir, file));
        candidates.push(..._candidates);
    }
    return candidates;
}
main();
