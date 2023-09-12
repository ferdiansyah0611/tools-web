type CompactNameReturn = {
  /**
   * "api/user-auth-v2/main-index.js" > "main_index"
   */
  Var: string;
  /**
   * "api/user-auth-v2/main-index.js" > "mainIndex"
   */
  camelCase: string;
  /**
   * "api/user-auth-v2/main-index.js" > "Main-Index"
   */
  titleCase: string;
  /**
   * "api/user-auth-v2/main-index.js" > "MainIndex"
   */
  titleCaseWordOnly: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2/main-index.js"
   */
  path: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2/main-index"
   */
  pathNoFormat: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2/mainIndex.js"
   */
  pathCamelCase: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2/Main-Index.js"
   */
  pathTitleCase: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2/MainIndex.js"
   */
  pathTitleCaseNoSeparate: string;
  /**
   * "api/user-auth-v2/main-index.js" > "api/user-auth-v2"
   */
  folder: string;
};

/**
 * remove format file from str
 * "hello-world.js" > "hello-world"
 */
export function toRemoveFormats(text: string): string {
  let lastDot = text.lastIndexOf(".");
  if (lastDot !== -1) text = text.slice(0, lastDot);
  return text;
}

/**
 * get folder from text
 */
export function getFolder(text: string): string {
  if (!text.includes("/")) return "";
  let lastSlash = text.lastIndexOf("/");
  if (lastSlash !== -1) {
    text = text.slice(0, lastSlash);
  }
  return text;
}

/**
 * convert str to be title case
 * "hello world" > "Hello World"
 */
export function toTitleCase(input: string): string {
  const words = input.split(/[-_]+/);
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });
  return capitalizedWords.join("-");
}

/**
 * add format file from str
 * "hello-world" > "hello-world.js"
 */
export function toAddFormat(text: string, format: string): string {
  return text.includes(".") ? text : text + format;
}

/**
 * convert str to be camel case, remove "-" and "_"
 * "hello-world" > "helloWorld"
 */
export function toCamelCase(text: string): string {
  var words = text.split(/[-_]+/);
  var result = words[0];

  for (var i = 1; i < words.length; i++) {
    var capitalizedWord = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    result += capitalizedWord;
  }

  return result;
}

/**
 * get variable
 */
export function getVariableName(name: string) {
  if (name.includes("/")) {
    let lastSlash = name.lastIndexOf("/");
    if (lastSlash !== -1) name = name.slice(lastSlash + 1);
  }
  return name.replaceAll(/[-/]/g, "_");
}

/**
 * compact naming from string like folder, variable, etc.
 */
export function compactName(name: string, format: string): CompactNameReturn {
  let data: any = {};
  return {
    Var: getVariableName(toRemoveFormats(name)),
    get camelCase() {
      if (!data.camelCase) data.camelCase = toCamelCase(this.Var);
      return data.camelCase;
    },
    get titleCase() {
      if (!data.titleCase) data.titleCase = toTitleCase(this.Var);
      return data.titleCase;
    },
    get titleCaseWordOnly() {
      if (!data.titleCaseWordOnly)
        data.titleCaseWordOnly = toTitleCase(this.Var).replaceAll(/[-_]+/g, "");
      return data.titleCaseWordOnly;
    },
    get path() {
      if (!data.path) data.path = toAddFormat(name, format);
      return data.path;
    },
    get pathNoFormat() {
      if (!data.pathNoFormat) data.pathNoFormat = toRemoveFormats(name);
      return data.pathNoFormat;
    },
    get pathCamelCase() {
      if (!data.pathCamelCase)
        data.pathCamelCase = toAddFormat(
          this.folder + "/" + this.camelCase,
          format,
        );
      return data.pathCamelCase;
    },
    get pathTitleCase() {
      if (!data.pathTitleCase)
        data.pathTitleCase = toAddFormat(
          this.folder + "/" + this.titleCase,
          format,
        );
      return data.pathTitleCase;
    },
    get pathTitleCaseNoSeparate() {
      if (!data.pathTitleCaseNoSeparate) {
        let v = toAddFormat(this.folder + "/" + this.titleCase, format);
        let lastSlash = v.lastIndexOf("/");
        if (lastSlash !== -1) {
          v =
            v.slice(0, lastSlash) + v.slice(lastSlash).replaceAll(/[-_]+/g, "");
        }
        data.pathTitleCaseNoSeparate = v;
      }
      return data.pathTitleCaseNoSeparate;
    },
    get folder() {
      if (!data.folder) data.folder = getFolder(name);
      return data.folder;
    },
  };
}
