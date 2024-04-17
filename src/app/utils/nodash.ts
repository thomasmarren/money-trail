export const get = (
  obj: Record<string, unknown>,
  path: string,
  defValue: unknown = null
) => {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = (
    Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
  ) as string[];
  // Find value
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && (prevObj[key] as Record<string, unknown>),
    obj
  );
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defValue : result;
};

type Sortable<T> = {
  [K in keyof T]: T[K] extends string | number | boolean ? T[K] : never;
};

export const orderBy = <T>(
  arr: T[],
  key: keyof Sortable<T>,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return arr.slice().sort((a, b) => {
    if (a[key] === b[key]) {
      return 0;
    }

    if (direction === "asc") return a[key] < b[key] ? -1 : 1;

    return a[key] > b[key] ? -1 : 1;
  });
};
