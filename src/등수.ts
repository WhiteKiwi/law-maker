/**
 * 4 2 2 1 1 이 들어오면 큰 순서대로 등수를 매긴다
 * 1 2 2 4 4 가 나와야 함
 */
export function 등수(arr: number[]): number[] {
  const map = new Map<number, number>();
  let rank = 1;
  for (const num of arr) {
    if (!map.has(num)) {
      map.set(num, rank);
    }
    rank++;
  }
  return arr.map((num) => map.get(num)!);
}
