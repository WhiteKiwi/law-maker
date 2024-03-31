import { readJSON, readdir } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  const candidates: LawMakerCadidate[] = [];
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  for (const file of files) {
    const _candidates = await readJSON(path.join(candidatesDir, file));
    candidates.push(..._candidates);
  }

  const map = new Map();
  for (const candidate of candidates) {
    if (map.has(candidate.이름)) {
      console.log(
        `중복된 후보: ${JSON.stringify(candidate, null, 2)} - ${JSON.stringify(
          map.get(candidate.이름),
          null,
          2
        )}`
      );
    }
    map.set(candidate.이름, candidate);
  }
}
main();
