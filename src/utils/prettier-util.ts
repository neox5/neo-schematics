import { Rule, SchematicsException, Tree } from "@angular-devkit/schematics";
import * as prettier from "prettier";

export function runPrettier(filePath: string): Rule {
  return (tree: Tree) => {
    const fileBuffer = tree.read(filePath);
    if (fileBuffer === null) {
      throw new SchematicsException(`Could not find ${filePath}`);
    }
    const fileString = fileBuffer.toString();

    tree.overwrite(filePath, prettier.format(fileString, { parser: "typescript" }))

    return tree;
  }
}
