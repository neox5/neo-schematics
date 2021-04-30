import { join, Path, strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  UpdateRecorder,
  url,
} from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import {
  Change,
  InsertChange,
  NoopChange,
  RemoveChange,
  ReplaceChange,
} from "@schematics/angular/utility/change";

import { Schema as ComponentOptions } from "./schema.interface";

import {
  buildDefaultPath,
  getDefaultProjectName,
  getProject,
  getQuoteSetting,
  getWorkspace,
  parseName,
  readIntoSourceFile,
} from "../utils";

export default function (options: ComponentOptions): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);

    let projectName = getDefaultProjectName(workspace);
    if (options.project) {
      projectName = options.project;
    }
    const project = getProject(workspace, projectName);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(options.path as string, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.quotes = getQuoteSetting(tree);
    options.prefix = project.prefix;

    // add template
    const sourceTemplates = url("./files");
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({ ...options, ...strings }),
      move(parsedPath.path),
    ]);

    udpateIndexFile(tree, options);

    return chain([mergeWith(sourceParametrizedTemplates)]);
  };
}

function udpateIndexFile(tree: Tree, options: ComponentOptions) {
  if (options.skipImport) {
    return;
  }

  const indexPath = findIndexFromOptions(tree, options.path);

  if (!indexPath) {
    throw new SchematicsException(
      "Could not found indexPath for adding import"
    );
  }

  const componentName = `${strings.classify(options.name)}Component`;
  const componentFilePath = `./${strings.dasherize(
    options.name
  )}/${strings.dasherize(options.name)}.component`;

  addImport(tree, indexPath, componentName, componentFilePath);

  addToExportArray(tree, indexPath, componentName);

  if (options.type == "view") {
    addExport(tree, indexPath, componentFilePath);
  }
}

function findIndexFromOptions(tree: Tree, path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  path = join(path as Path, "index.ts");

  return tree.exists(path) ? path : undefined;
}

function addImport(
  tree: Tree,
  indexPath: string,
  componentName: string,
  componentFilePath: string
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
  const toInsert = `${separator}import { ${componentName} } from "${componentFilePath}"${lineEnd}`;

  const recorder = tree.beginUpdate(indexPath);
  const change = new InsertChange(indexPath, pos, toInsert);
  // if (change instanceof InsertChange) {
  //   recorder.insertRight(change.pos, change.toAdd)
  // }
  applyToUpdateRecorder(recorder, [change]);
  tree.commitUpdate(recorder);
}

function addToExportArray(
  tree: Tree,
  indexPath: string,
  componentName: string
): void {
  const sourceFile = readIntoSourceFile(tree, indexPath);
  // https://ts-ast-viewer.com
  const identifierCount = tsquery(
    sourceFile,
    "ArrayLiteralExpression > Identifier"
  ).length;
  const pos = tsquery(sourceFile, "ArrayLiteralExpression")[0].getEnd();

  if (identifierCount !== 0) {
    componentName = ", " + componentName;
  }

  const recorder = tree.beginUpdate(indexPath);
  const change = new InsertChange(indexPath, pos - 1, componentName);
  applyToUpdateRecorder(recorder, [change]);
  tree.commitUpdate(recorder);
}

function addExport(
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
