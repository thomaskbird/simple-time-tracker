export function makeArrayFromSnapshot<T>(snap: T[]) {
  const data: T[] = [];
  snap.forEach((item: any) => {
    data.push({
      ...item.data(),
      id: item.id
    });
  })

  return data;
}

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

export function makeNewFilteredArrayWithUpdatedVal<T>(arr: T[], compareField: keyof  T, field: keyof T, target: string, val: any) {
  const newArr: T[] = [];

  arr.forEach(item => {
    if(item[compareField] === target) {
      newArr.push({
        ...item,
        [field]: val
      });
    } else {
      newArr.push(item);
    }
  });

  return newArr;
}
