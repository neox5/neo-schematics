import { join, Path } from "@angular-devkit/core";
import { Rule, Tree } from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import { InsertChange } from "@schematics/angular/utility/change";

import { readIntoSourceFile } from "./read-into-source-file";
import { applyToUpdateRecorder } from "./recorder-util";

export function findIndexFromPath(
  tree: Tree,
  path?: string
): string | undefined {
  if (!path) {
    return undefined;
  }

  path = join(path as Path, "index.ts");

  return tree.exists(path) ? path : undefined;
}

export function addExportToIndex(
  indexPath: string,
  exportFilePath: string
): Rule {
  return (tree: Tree) => {
    // https://ts-ast-viewer.com
    const sourceFile = readIntoSourceFile(tree, indexPath);
    const isFirst = tsquery(sourceFile, "ExportDeclaration").length == 0;
    // TODO: fix new line for export only index.ts
    const separator = isFirst ? "\n" : "";
    const toInsert = `${separator}export * from "${exportFilePath}";\n`;
    const endOfFilePos = tsquery(sourceFile, "EndOfFileToken")[0].getStart();

    const recorder = tree.beginUpdate(indexPath);
    const change = new InsertChange(indexPath, endOfFilePos, toInsert);
    applyToUpdateRecorder(recorder, [change]);
    tree.commitUpdate(recorder);

    return tree;
  };
}

export function appendIndexExportArray(
  indexPath: string,
  symbolName: string
): Rule {
  return (tree: Tree) => {
    const sourceFile = readIntoSourceFile(tree, indexPath);
    // https://ts-ast-viewer.com
    const identifierCount = tsquery(
      sourceFile,
      "ArrayLiteralExpression > Identifier"
    ).length;
    const pos = tsquery(sourceFile, "ArrayLiteralExpression")[0].getEnd();

    if (identifierCount !== 0) {
      symbolName = ", " + symbolName;
    }

    const recorder = tree.beginUpdate(indexPath);
    const change = new InsertChange(indexPath, pos - 1, symbolName);
    applyToUpdateRecorder(recorder, [change]);
    tree.commitUpdate(recorder);

    return tree;
  };
}
