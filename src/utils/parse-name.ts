import { Path, basename, dirname, join, normalize } from "@angular-devkit/core";

export interface Location {
  name: string;
  dir: Path;
}

export function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const dirName = dirname(join(normalize(path), name) as Path);



  return {
    name: nameWithoutPath,
    dir: normalize("/" + dirName),
  };
}
