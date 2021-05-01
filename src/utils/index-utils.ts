import { join, Path } from "@angular-devkit/core";
import { Tree, UpdateRecorder } from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import { Change, InsertChange, NoopChange, RemoveChange, ReplaceChange } from "@schematics/angular/utility/change";

import { readIntoSourceFile } from "./read-into-source-file";

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

export function addImportToIndex(
  tree: Tree,
  indexPath: string,
  symbolName: string,
  symbolFilePath: string
): void {
  const sourceFile = readIntoSourceFile(tree, indexPath);

  const importNodes = tsquery(sourceFile, "ImportDeclaration > StringLiteral");

  const isBeginning = importNodes.length == 0;

  let pos = 0;
  if (!isBeginning) {
    pos = importNodes[importNodes.length - 1].getEnd();
  }
  const separator = isBeginning ? "" : ";\n";
  const lineEnd = isBeginning ? ";\n\n" : "";
  const toInsert = `${separator}import { ${symbolName} } from "${symbolFilePath}"${lineEnd}`;

  const recorder = tree.beginUpdate(indexPath);
  const change = new InsertChange(indexPath, pos, toInsert);

  applyToUpdateRecorder(recorder, [change]);
  tree.commitUpdate(recorder);
}

export function addExportToIndex(
  tree: Tree,
  indexPath: string,
  exportFilePath: string
): void {
  const sourceFile = readIntoSourceFile(tree, indexPath);
  const isFirst = tsquery(sourceFile, "ExportDeclaration").length == 0;
  const separator = isFirst ? "\n" : "";
  const toInsert = `${separator}export * from "${exportFilePath}";\n`;
  const endOfFilePos = tsquery(sourceFile, "EndOfFileToken")[0].getStart();

  const recorder = tree.beginUpdate(indexPath);
  const change = new InsertChange(indexPath, endOfFilePos, toInsert);
  applyToUpdateRecorder(recorder, [change]);
  tree.commitUpdate(recorder);
}

export function appendIndexExportArray(
  tree: Tree,
  indexPath: string,
  symbolName: string
): void {
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
}

function applyToUpdateRecorder(
  recorder: UpdateRecorder,
  changes: Change[]
): void {
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove(change.order, change.toRemove.length);
    } else if (change instanceof ReplaceChange) {
      recorder.remove(change.order, change.oldText.length);
      recorder.insertLeft(change.order, change.newText);
    } else if (!(change instanceof NoopChange)) {
      throw new Error(
        "Unknown Change type encountered when updating a recorder."
      );
    }
  }
}