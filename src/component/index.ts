import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  schematic,
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
  runPrettier,
  splitSubpath,
} from "../utils";

export default function (options: ComponentOptions): Rule {
  return async (tree: Tree) => {
    let rule = chain([]);
    if (options.debug) {
      rule = chain([rule, schematic("debug", options)]);
    }

    const rootPath = await getRootPathFromProject(tree, options.project);

    let { symbolDir, symbolName } = splitSubpath(options.subpath);

    if (options.type == "view") {
      if (symbolName.indexOf("-view") == -1) {
        symbolName = symbolName + "-view";
      }
    }

    const quotes = getQuoteSetting(tree);
    const prefix = await getPrefix(tree, options.project);

    // add template
    const sourceTemplates = url("./files");
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({ ...options, ...strings, name: symbolName, quotes, prefix }),
      move(rootPath + symbolDir),
    ]);

    if (options.skipImport) {
      return chain([rule, mergeWith(sourceParametrizedTemplates)]);
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
      rule,
      mergeWith(sourceParametrizedTemplates),
      addImport(indexPath, componentName, componentFilePath),
      appendIndexExportArray(indexPath, componentName),
      options.type == "view"
        ? addExportToIndex(indexPath, componentFilePath)
        : noop(),
      runPrettier(indexPath),
    ]);
  };
}
