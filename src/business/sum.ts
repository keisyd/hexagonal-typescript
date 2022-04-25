export const sum = (a: number, b: number) => {
  return a + b;
};

export const countApplesAndOranges = (
  s: number,
  t: number,
  a: number,
  b: number,
  apples: number[],
  oranges: number[]
): void => {
  let appleCount = 0;
  let orangeCount = 0;
  for (let i = 0; i < apples.length; i++) {
    if (a + apples[i] >= s && a + apples[i] <= t) {
      appleCount++;
    }
  }
  for (let j = 0; j < oranges.length; j++) {
    if (b + oranges[j] <= t && b + oranges[j] >= s) {
      orangeCount++;
    }
  }
  console.log(appleCount);
  console.log(orangeCount);
  console.log(orangeCount);
}
