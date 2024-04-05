import { readJSON, writeJSON } from "fs-extra";
import path from "path";
import { LawMakerCadidate } from "./law-maker-candidate";
import { Region, RegionsJson } from "./region";

async function main() {
  const filePath = path.join(__dirname, "../data/regions.json");
  const regionsJson: RegionsJson = await readJSON(filePath);
  for (const regionData of regionsJson) {
    const regions: Region[] = [];
    for (const region of regionData.regions) {
      let count = 0;
      const 시군구Arr = region.시군구.split("/");
      if (시군구Arr.length === 1) {
        regions.push(region);
        continue;
      }
      for (const 시군구 of 시군구Arr) {
        count++;
        regions.push({
          ...region,
          id: `${region.id}_${count}`,
          시군구,
        });

        const candidatesDir = path.join(__dirname, `../data/candidates`);
        const candidates: LawMakerCadidate[] = await readJSON(
          path.join(candidatesDir, region.id + ".json")
        );
        const regionId = `${region.id}_${count}`;
        await writeJSON(
          path.join(candidatesDir, `${region.id}_${count}.json`),
          candidates.map((c) => ({
            ...c,
            id: `${regionId}-${c.기호}`,
            regionId,
            공보PdfUrl: c.공보PdfUrl.replace(region.id, regionId),
          })),
          { spaces: 2 }
        );
      }
    }
    regionData.regions = regions;
  }
  await writeJSON(filePath, regionsJson, { spaces: 2 });
}
main();
