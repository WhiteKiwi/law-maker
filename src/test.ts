import { readJSON, readdir } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";
import { RegionsJson } from "./region";

async function main() {
  {
    const candidatesDir = path.join(__dirname, "../data/candidates");
    const files = await readdir(candidatesDir);
    for (const file of files) {
      const candidates: LawMakerCadidate[] = await readJSON(
        path.join(candidatesDir, file)
      );
      for (const candidate of candidates) {
        try {
          LawMakerCadidate.parse(candidate);
        } catch (e) {
          console.log("candidate error!!!!!!", candidate);
          throw e;
        }
      }
    }
  }

  {
    const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
    const files = await readdir(lawMakerDir);
    for (const file of files) {
      const lawMaker = await readJSON(path.join(lawMakerDir, file));
      try {
        LawMaker.parse(lawMaker);
      } catch (e) {
        console.log("lawmaker error:", file);
        throw e;
      }
    }
  }

  {
    const filePath = path.join(__dirname, "../data/regions.json");
    const regionsJson: RegionsJson = await readJSON(filePath);
    try {
      RegionsJson.parse(regionsJson);
    } catch (e) {
      console.log("regions.json error !!!!!!!!!!!!!!!");
      throw e;
    }
  }
}
main();
