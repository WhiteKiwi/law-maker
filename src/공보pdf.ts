import axios from "axios";
import { exists, readJSON, readdir, writeFileSync, writeJson } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  console.log("files.length", files.length);
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );

    candidates.forEach((candidate) => {
      candidate.공보PdfUrl = `https://s3.whitekiwi.link/vote-for.kr/공보/${candidate.id}.pdf`;
    });
    await writeJson(path.join(candidatesDir, file), candidates, { spaces: 2 });
    // save pdf
    // Promise.all(
    //   candidates.map(async (candidate) => {
    //     if (!candidate.공보PdfUrl) {
    //       console.log("no pdf url!!!!!!!!!!", candidate.id);
    //       return;
    //     }
    //     await savePdf(candidate);
    //   })
    // );
  }
}

async function savePdf(candidate: LawMakerCadidate) {
  const file = path.join(__dirname, `../vote-for.kr/공보/${candidate.id}.pdf`);
  if (await exists(file)) {
    return;
  }
  console.log("candidate.id", candidate.id);
  console.log("candidate.공보PdfUrl", candidate.공보PdfUrl);
  const response = await axios.get(candidate.공보PdfUrl, {
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf",
    },
  });
  console.log("done");
  const buffer = Buffer.from(response.data, "binary");
  writeFileSync(file, buffer);
}

main();
