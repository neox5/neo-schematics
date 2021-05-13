import { basename, dirname, normalize } from "@angular-devkit/core";

export function splitSubpath(subpath: string): {
  symbolDir: string;
  symbolName: string;
} {
  return {
    symbolDir: dirname(normalize(subpath)),
    symbolName: basename(normalize(subpath)),
  };
}
