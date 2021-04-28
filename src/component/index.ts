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
  url,
} from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import { insertImport } from "@schematics/angular/utility/ast-utils";
import { InsertChange } from "@schematics/angular/utility/change";

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

    addImportToIndex(tree, options);

    return chain([mergeWith(sourceParametrizedTemplates)]);
  };
}

function addImportToIndex(tree: Tree, options: ComponentOptions){
  if (options.skipImport) {
    return;
  }

  const indexPath = findIndexFromOptions(tree, options.path);

  if (!indexPath) {
    throw new SchematicsException(
      "Could not found indexPath for adding import"
    );
  }

  const symbolName = `{ ${strings.classify(options.name)}Component }`;
  const fileName = `./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.component`;
  // const importStr =
  //   `import { ${strings.classify(options.name)}Component } ` +
  //   "from " +
  //   `"./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.component";\n`;

  let recorder = tree.beginUpdate(indexPath);
  let sourceFile = readIntoSourceFile(tree, indexPath) 
  let change = insertImport(sourceFile, indexPath, symbolName, fileName, true)
  if (change instanceof InsertChange) {
    recorder.insertRight(change.pos, change.toAdd)
  }
  tree.commitUpdate(recorder);

  // add Component to export array
  sourceFile = readIntoSourceFile(tree, indexPath);
  let importStr = strings.classify(options.name) + "Component";
  const identifierCount = tsquery(
    sourceFile,
    "ArrayLiteralExpression > Identifier"
  ).length;
  const pos = tsquery(sourceFile, "ArrayLiteralExpression")[0].getEnd();

  if (identifierCount !== 0) {
    importStr = ", " + importStr;
  }
  
  recorder = tree.beginUpdate(indexPath);
  change = new InsertChange(indexPath, pos - 1, importStr);
  if (change instanceof InsertChange) {
    recorder.insertLeft(change.pos, change.toAdd);
  }
  tree.commitUpdate(recorder);
}

function findIndexFromOptions(
  tree: Tree,
  path?: string
): string | undefined {
  if (!path) {
    return undefined;
  }

  path = join(path as Path, "index.ts");

  return tree.exists(path) ? path : undefined;
}