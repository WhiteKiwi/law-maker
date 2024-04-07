"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchCandidate = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function main() {
    {
        const candidateDir = path_1.default.join(__dirname, "../data/candidates");
        const files = await (0, fs_extra_1.readdir)(candidateDir);
        for (const file of files) {
            if (file.includes("_")) {
                continue;
            }
            const filePath = path_1.default.join(candidateDir, file);
            const candidates = await (0, fs_extra_1.readJSON)(filePath);
            candidates.forEach((c) => {
                delete c.id_21th;
            });
            (0, fs_extra_1.writeJsonSync)(filePath, candidates, { spaces: 2 });
        }
    }
    const lawMakers = await loadLawMakers();
    for (const lawMaker of lawMakers) {
        if (["김병욱"].includes(lawMaker.이름)) {
            continue;
        }
        const candidateDir = path_1.default.join(__dirname, "../data/candidates");
        const files = (0, fs_extra_1.readdirSync)(candidateDir);
        for (const file of files) {
            if (file.includes("_")) {
                continue;
            }
            const filePath = path_1.default.join(candidateDir, file);
            const candidates = (0, fs_extra_1.readJSONSync)(filePath);
            const candidate = matchCandidate(lawMaker, candidates);
            if (candidate) {
                candidate.id_21th = lawMaker.id;
            }
            (0, fs_extra_1.writeJsonSync)(filePath, candidates, { spaces: 2 });
        }
    }
}
function matchCandidate(lawMaker, candidates) {
    const 이름같은사람들 = candidates.filter((c) => c.이름 === lawMaker.이름);
    if (이름같은사람들.length === 0) {
        return null;
    }
    if (이름같은사람들.length === 1) {
        if (["장동혁", "성일종", "박주민", "홍익표", "권성동"].includes(lawMaker.이름)) {
            return 이름같은사람들[0];
        }
        if (["이용우"].includes(lawMaker.이름)) {
            return null;
        }
        const is21대국회의원 = 이름같은사람들[0].경력
            .split("\n")
            .find((경력) => 경력.includes("국회의원") && (경력.includes("현") || "21대")) ||
            이름같은사람들[0].직업.startsWith("국회의원") ||
            이름같은사람들[0].직업.endsWith("국회의원");
        const is정당같음 = 이름같은사람들[0].정당 === lawMaker.정당;
        if (is21대국회의원 && is정당같음) {
            return 이름같은사람들[0];
        }
        if (is21대국회의원 && !is정당같음) {
            console.log("정당이 다름", lawMaker.이름);
            return null;
        }
        if (!is21대국회의원 && is정당같음) {
            console.log("21대 국회의원 아님", lawMaker.이름);
            return null;
        }
        if (!is21대국회의원 && !is정당같음) {
            console.log("21대 국회의원 아님, 정당 다름", lawMaker.이름);
            return null;
        }
    }
    if (이름같은사람들.length > 1) {
        console.log("이름 같은 사람이 여러명", lawMaker.이름);
        return null;
    }
    return null;
}
exports.matchCandidate = matchCandidate;
main();
async function loadLawMakers() {
    const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    const lawMakers = [];
    for (const file of files) {
        const filePath = path_1.default.join(lawMakerDir, file);
        const lawMaker = await (0, fs_extra_1.readJSON)(filePath);
        lawMakers.push(lawMaker);
    }
    return lawMakers;
}
async function loadUnitedCandidates() {
    const candidates = [];
    const lawMakerDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    for (const file of files) {
        if (file.includes("_")) {
            continue;
        }
        const _candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
        candidates.push(..._candidates);
    }
    return candidates;
}
