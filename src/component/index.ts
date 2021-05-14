import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicsException,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";

import { Schema as ComponentOptions } from "./schema.interface";

import {
  addExportToIndex,
  addImport,
  appendIndexExportArray,
  findIndexFromPath,
  getPrefix,
  getQuoteSetting,
  getRootPathFromProject,
  splitSubpath,
} from "../utils";

export default function (options: ComponentOptions): Rule {
  return async (tree: Tree) => {
    const rootPath = await getRootPathFromProject(tree, options.project);

    const { symbolDir, symbolName } = splitSubpath(options.subpath);

    const quotes = getQuoteSetting(tree);
    const prefix = await getPrefix(tree, options.project);

    // add template
    const sourceTemplates = url("./files");
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({ ...options, ...strings, name: symbolName, quotes, prefix }),
      move(rootPath + symbolDir),
    ]);

    if (options.skipImport) {
      return mergeWith(sourceParametrizedTemplates);
    }

    // add import
    const indexPath = findIndexFromPath(tree, rootPath + symbolDir);
    if (!indexPath) {
      throw new SchematicsException(
        "Could not found indexPath for adding import"
      );
    }

    const componentName = `${strings.classify(symbolName)}Component`;
    const componentFilePath = `./${strings.dasherize(
      symbolName
    )}/${strings.dasherize(symbolName)}.component`;

    return chain([
      mergeWith(sourceParametrizedTemplates),
      addImport(indexPath, componentName, componentFilePath),
      appendIndexExportArray(indexPath, componentName),
      options.type == "view"
        ? addExportToIndex(indexPath, componentFilePath)
        : noop(),
    ]);
  };
}
