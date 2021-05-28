import { join, Path, strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  schematic,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import {
  addImport,
  addExportToIndex,
  addToConstructor,
  findIndexFromPath,
  getRootPathFromProject,
  splitSubpath,
  runPrettier,
} from "../utils";

import { Schema as ServiceSchema, ServiceType } from "./schema.interface";

export default function (options: ServiceSchema): Rule {
  return async (tree: Tree) => {
    let rule = chain([]);
    if (options.debug) {
      rule = chain([rule, schematic("debug", options)]);
    }

    const rootPath = await getRootPathFromProject(tree, options.project);

    const { symbolDir, symbolName } = splitSubpath(options.subpath);

    const sourceTemplates = url(getTemplateUrl(options.type));
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
        name: symbolName,
      }),
      move(rootPath + symbolDir),
    ]);

    rule = chain([rule, mergeWith(sourceParametrizedTemplates)]);

    // Fixes: Cannot redeclare block-scoped variable e.g. "indexPath"
    let indexPath;
    let symbolFilePath;

    if (options.skipimport) {
      return rule;
    }

    switch (options.type) {
      case "":
        if (!findIndexFromPath(tree, rootPath + symbolDir)) {
          // if not index.ts file exists create one
          tree.create(rootPath + symbolDir + "/index.ts", "");
        }

        // add export to index.ts
        indexPath = rootPath + symbolDir + "/index.ts";
        symbolFilePath = `./${strings.dasherize(
          symbolName
        )}/${strings.dasherize(symbolName)}.service`;

        rule = chain([
          rule,
          addExportToIndex(indexPath, symbolFilePath),
          runPrettier(indexPath),
        ]);
        break;
      case "api":
        
        if (!findIndexFromPath(tree, rootPath + symbolDir)) {
          // if not index.ts file exists create one
          tree.create(rootPath + symbolDir + "/index.ts", "");
        }

        // add export to index.ts
        indexPath = rootPath + symbolDir + "/index.ts";
        symbolFilePath = `./${strings.dasherize(
          symbolName
        )}/${strings.dasherize(symbolName)}-api.service`;

        rule = chain([
          rule,
          addExportToIndex(indexPath, symbolFilePath),
          runPrettier(indexPath),
        ]);

        break;
      case "sandbox":
        // create utility service for sandbox
        const utilServiceOptions: ServiceSchema = {
          subpath: symbolDir + "/util/" + symbolName,
          type: "util",
          project: options.project,
        };

        rule = chain([rule, schematic("neo-service", utilServiceOptions)]);

        break;
      case "util":
        if (!findIndexFromPath(tree, rootPath + symbolDir)) {
          // if not index.ts file exists create one
          tree.create(rootPath + symbolDir + "/index.ts", "");
        }

        // add export to index.ts
        indexPath = rootPath + symbolDir + "/index.ts";
        const symbolFullName = strings.classify(symbolName + "UtilService");
        const symbolVarName =
          "_" + strings.camelize(symbolName + "UtilService");
        symbolFilePath = `./${strings.dasherize(
          symbolName
        )}/${strings.dasherize(symbolName)}-util.service`;

        const sandboxPath = join(
          (rootPath + symbolDir) as Path,
          "../home-sandbox.service.ts"
        );

        rule = chain([
          rule,
          addExportToIndex(indexPath, symbolFilePath),
          addImport(sandboxPath, symbolFullName, "./util"),
          addToConstructor(sandboxPath, symbolVarName, symbolFullName),
          runPrettier(sandboxPath),
        ]);

        break;
    }

    return rule;
  };
}

function getTemplateUrl(type?: ServiceType): string {
  switch (type) {
    case "api":
      return "./files/api";
    case "sandbox":
      return "./files/sandbox";
    case "util":
      return "./files/util";
    default:
      return "./files/service";
  }
}
