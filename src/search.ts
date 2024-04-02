import { readJSON } from "fs-extra";
import path from "path";

export type SearchItem = {
  id: string; // candidateId
  imageUrl: string;
  이름: string;
  splitted이름: string;
  지역구: string;
  정당: string;
};

export function search(query: string, searchItems: SearchItem[]): SearchItem[] {
  const spllitedQuery = splitHangul(query);
  return searchItems.filter((item) =>
    item.splitted이름.includes(spllitedQuery)
  );
}

export function splitHangul(text: string) {
  const baseCode = 44032;
  const choBase = 588;
  const jungBase = 28;
  const cho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const jung = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const jong = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  let result = "";

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    if (charCode >= 44032 && charCode <= 55203) {
      const unicode = charCode - baseCode;
      const choIdx = Math.floor(unicode / choBase);
      const jungIdx = Math.floor((unicode - choBase * choIdx) / jungBase);
      const jongIdx = unicode - choBase * choIdx - jungBase * jungIdx;
      result += cho[choIdx] + jung[jungIdx] + jong[jongIdx];
    } else {
      result += text.charAt(i);
    }
  }

  return result;
}

async function main() {
  const searchItems = await readJSON(
    path.join(__dirname, "../data/search.json")
  );
  console.time();
  console.log(search("이", searchItems));
  console.log(search("이재", searchItems));
  console.log(search("이ㅈ", searchItems));
  console.log(search("심상ㅈ", searchItems));
  console.log(search("상ㅈ", searchItems));
  console.log(search("이재명", searchItems));
  console.log(search("심", searchItems));
  console.log(search("김", searchItems));
  console.log(search("심상", searchItems));
  console.log(search("상정", searchItems));
  console.timeEnd();

  console.log(splitHangul("이재명"));
  console.log(splitHangul("꿿뻵똟"));
  console.log(splitHangul("이ㅈ"));
}
main();
