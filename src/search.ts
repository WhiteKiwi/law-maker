import { readJSON } from "fs-extra";
import path from "path";

export type SearchItem = {
  id: string; // candidateId
  imageUrl: string;
  이름: string;
  지역구: string;
  정당: string;
};

export function search(query: string, searchItems: SearchItem[]): SearchItem[] {
  return searchItems.filter((item) => item.이름.includes(query));
}

async function main() {
  const searchItems = await readJSON(
    path.join(__dirname, "../data/search.json")
  );
  console.time();
  console.log(search("이", searchItems));
  console.log(search("이재", searchItems));
  console.log(search("재명", searchItems));
  console.log(search("재명", searchItems));
  console.log(search("재명", searchItems));
  console.log(search("이재명", searchItems));
  console.log(search("심", searchItems));
  console.log(search("김", searchItems));
  console.log(search("심상", searchItems));
  console.log(search("상정", searchItems));
  console.timeEnd();
}
main();
