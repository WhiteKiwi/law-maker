import { readJSON, readdir, writeJsonSync } from "fs-extra";
import path from "path";

async function main() {
  const candidateDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidateDir);
  for (const file of files) {
    const filePath = path.join(candidateDir, file);
    const candidates = await readJSON(filePath);
    // sync-detail
    for (const candidate of candidates) {
      writeJsonSync(
        path.join(__dirname, `../data/candidate-details/${candidate.id}.json`),
        candidate,
        { spaces: 2 }
      );
    }
    writeJsonSync(filePath, candidates, { spaces: 2 });
  }
}

main();
