import { Tree } from "@angular-devkit/schematics";
import { getJson } from "./get-json";

export function getQuoteSetting(tree: Tree): "single" | "double" {
  const tslint = getJson(tree, "tslint.json");
  let doubleQuotes = false;

  if (tslint && tslint.rules && tslint.rules.quotemark) {
    // quotemark is a string list which includes the single/double setting
    doubleQuotes = (tslint.rules.quotemark as string[]).includes("double");
  }

  return doubleQuotes ? "double" : "single";
}
