export function makeNewFilteredArray<T>(arr: T[], field: keyof T, val: any) {
  const newArr: T[] = [];
  arr.forEach(item => {
    newArr.push({
      ...item,
      [field]: val
    });
  });

  return newArr;
}