import axios from "axios";
import { readJSON, readdir, writeFileSync, writeJSON } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  let count = 0;
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );

    for (const candidate of candidates) {
      console.log(++count);
      if (count < 400) {
        continue;
      }
      if (!candidate.전과PdfUrl) {
        console.log("no pdf url!!!!!!!!!!", candidate.id);
        continue;
      }

      await saveImage(candidate);
      candidate.전과PdfUrl = `https://raw.githubusercontent.com/WhiteKiwi/law-maker/main/data/images/jeon-gwa/${candidate.id}.jpg`;
    }

    await writeJSON(path.join(candidatesDir, file), candidates, { spaces: 2 });
  }
}

async function saveImage(candidate: LawMakerCadidate) {
  const response = await axios.get(candidate.전과PdfUrl, {
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf",
    },
  });
  console.log("candidate.id", candidate.id);
  const buffer = Buffer.from(response.data, "binary");
  const file = path.join(__dirname, `../data/tmp/${candidate.id}.pdf`);
  writeFileSync(file, buffer);
}

main();
