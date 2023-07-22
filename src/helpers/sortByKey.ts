const sortByKey = (arr: any, key: string, rev = false) => {
  let sortedCopy = [...arr];
  sortedCopy.sort((a: any, b: any) => {
    return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
  });

  if(rev) {
    return sortedCopy.reverse();
  }

  return sortedCopy;
}

export default sortByKey;