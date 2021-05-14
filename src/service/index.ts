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
  findIndexFromPath,
  getRootPathFromProject,
  splitSubpath,
} from "../utils";

import { Schema as ServiceSchema, ServiceType } from "./schema.interface";

export default function (options: ServiceSchema): Rule {
  return async (tree: Tree) => {
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

    let rule = mergeWith(sourceParametrizedTemplates);

    switch (options.type) {
      case "sandbox":
        if (!options.skiputil) {
          // create utility service for sandbox
          const utilServiceOptions: ServiceSchema = {
            subpath: symbolDir + "/util/" + symbolName,
            type: "util",
            project: options.project,
          };

          rule = chain([rule, schematic("neo-service", utilServiceOptions)]);
        }

        break;
      case "util":
        if (!findIndexFromPath(tree, rootPath + symbolDir)) {
          // if not index.ts file exists create one
          tree.create(rootPath + symbolDir + "/index.ts", "");
        }

        // add export to index.ts
        const indexPath = rootPath + symbolDir + "/index.ts";
        const symbolFilePath = `./${strings.dasherize(
          symbolName
        )}/${strings.dasherize(symbolName)}-util.service`;

        rule = chain([
          rule,
          addExportToIndex(indexPath, symbolFilePath),
          addImport(
            join(rootPath + symbolDir as Path, "../home-sandbox.service.ts"),
            strings.classify(symbolName + "UtilService"),
            "./util"
          ),
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
