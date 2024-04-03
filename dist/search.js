"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitHangul = exports.search = void 0;
function search(query, searchItems) {
    const spllitedQuery = splitHangul(query);
    return searchItems.filter((item) => item.splitted이름.includes(spllitedQuery));
}
exports.search = search;
function splitHangul(text) {
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
        }
        else {
            result += text.charAt(i);
        }
    }
    return result;
}
exports.splitHangul = splitHangul;
