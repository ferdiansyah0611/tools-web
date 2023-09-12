/**
 * create code from string, auto add new lines
 */
export function code(...values: string[]) {
  let v = "";

  function next(value: string) {
    v += value + "\n";
  }

  for (let value of values) {
    next(value);
  }

  return {
    next,
    v,
    set(value: string) {
      v = value;
    },
    get t() {
      v += "\t";
      return this;
    },
  };
}
