import { Tree } from "@angular-devkit/schematics";
import { getFile } from "./file-util";

export function getQuoteSetting(tree: Tree): "single" | "double" {
  const editorConfig = getFile(tree, ".editorconfig");
  const quoteRegex = /quote_type\s*=\s*(double|single)/g;
  const match = quoteRegex.exec(editorConfig);
  
  if (match && match.length > 0) {
    return match[1] as "single" | "double";
  }
  return "double";
}
