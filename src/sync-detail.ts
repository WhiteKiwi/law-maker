import { readJSON, readdir, writeJsonSync } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  const candidates = await loadCandidates();
  for (const candidate of candidates) {
    console.log("candidate", candidate);

    writeJsonSync(
      path.join(__dirname, `../data/candidate-details/${candidate.id}.json`),
      candidate,
      { spaces: 2 }
    );
  }
}

async function loadCandidates(): Promise<LawMakerCadidate[]> {
  const candidates: LawMakerCadidate[] = [];
  const candidateDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidateDir);
  for (const file of files) {
    const _candidates = await readJSON(path.join(candidateDir, file));
    candidates.push(..._candidates);
  }
  return candidates;
}
main();
