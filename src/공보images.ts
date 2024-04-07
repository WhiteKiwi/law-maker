import { readJSON, readdir, writeJsonSync } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";
async function main() {
  const images = await readdir(
    path.join(__dirname, "../vote-for.kr/공보/images")
  );

  const candidateDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidateDir);
  for (const file of files) {
    const filePath = path.join(candidateDir, file);
    const candidates: LawMakerCadidate[] = await readJSON(filePath);
    for (const candidate of candidates) {
      candidate.공보ImgUrls = images
        .filter((image) => image.startsWith(candidate.id))
        .map(
          (image) =>
            `https://s3.whitekiwi.link/vote-for.kr/공보/images/${image}`
        );
    }

    writeJsonSync(filePath, candidates, { spaces: 2 });
  }
}
main();
