import axios from "axios";
import { readJSON, readdir, writeFile, writeJSON } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );

    for (const candidate of candidates) {
      await saveImage(candidate);
      candidate.imageUrl = `https://raw.githubusercontent.com/WhiteKiwi/law-maker/main/data/images/${candidate.id}.jpg`;
    }

    await writeJSON(path.join(candidatesDir, file), candidates, { spaces: 2 });
  }
}

async function saveImage(candidate: LawMakerCadidate) {
  const response = await axios.get(candidate.imageUrl, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "binary");
  await writeFile(
    path.join(__dirname, `../data/images/${candidate.id}.jpg`),
    buffer
  );
}

main();
