"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.등수 = void 0;
function 등수(arr) {
    const map = new Map();
    let rank = 1;
    for (const num of arr) {
        if (!map.has(num)) {
            map.set(num, rank);
        }
        rank++;
    }
    return arr.map((num) => map.get(num));
}
exports.등수 = 등수;
