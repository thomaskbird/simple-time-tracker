const sortByKey = (arr: any, key: string, rev = false) => {
  const sorted = arr.sort((a: any, b: any) =>
    a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
  );

  if(rev) {
    return sorted.reverse();
  }

  return sorted;
}

export default sortByKey;