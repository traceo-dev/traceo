export const uniqueArray = (array: string[]) =>
  array.filter((item, pos) => array.indexOf(item) === pos);

export const sortBy = <T>(arr: T[], key: string, isAsc?: boolean): T[] => {
  const sorted = arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] > b[key]) {
      return 1;
    } else {
      return 0;
    }
  });

  return isAsc ? sorted : sorted.reverse();
};

export const getDuplicates = <T>(array: T[]): T[] =>
  array.reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) {
      acc.push(el);
    }

    return acc;
  }, []);

export const chunk = <T>(input: T[], chunkSize: number): T[][] => {
  const chunks = [];
  let i = 0;
  while (i < input.length) {
    chunks.push(input.slice(i, (i += chunkSize)));
  }
  return chunks;
};

export const combineArray = (arr: any[], arr2: any[]) => [...arr, ...arr2];
