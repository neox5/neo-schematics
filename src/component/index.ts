import { strings } from "@angular-devkit/core";
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

import { Schema as ComponentOptions } from "./schema.interface";

import {
  buildDefaultPath,
  getDefaultProjectName,
  getProject,
  getQuoteSetting,
  getWorkspace,
  parseName,
  findIndexFromPath,
  addImportToIndex,
  addExportToIndex,
  appendIndexExportArray
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

  const indexPath = findIndexFromPath(tree, options.path);

  if (!indexPath) {
    throw new SchematicsException(
      "Could not found indexPath for adding import"
    );
  }

  const componentName = `${strings.classify(options.name)}Component`;
  const componentFilePath = `./${strings.dasherize(
    options.name
  )}/${strings.dasherize(options.name)}.component`;

  addImportToIndex(tree, indexPath, componentName, componentFilePath);

  appendIndexExportArray(tree, indexPath, componentName);

  if (options.type == "view") {
    addExportToIndex(tree, indexPath, componentFilePath);
  }
}
