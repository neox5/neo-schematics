import { strings } from "@angular-devkit/core";
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
  buildDefaultPath,
  getDefaultProjectName,
  getProject,
  getWorkspace,
  parseName,
} from "../utils";

import { Schema as ServiceSchema, ServiceType } from "./schema.interface";

export default function (options: ServiceSchema): Rule {
  return async (tree: Tree) => {
    const workspace = await getWorkspace(tree);

    let projectName = getDefaultProjectName(workspace);
    if (options.project) {
      projectName = options.project;
    }
    const project = getProject(workspace, projectName);

    const parsedPath = parseName(
      buildDefaultPath(project) as string,
      options.name
    );

    const sourceTemplates = url(getTemplateUrl(options.type));
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
        name: parsedPath.name,
      }),
      move(parsedPath.path),
    ]);

    let rule = mergeWith(sourceParametrizedTemplates);

    switch (options.type) {
      case "sandbox":
        const utilServiceOptions: ServiceSchema = {
          name: options.name,
          type: "util",
          project: options.project,
        };

        const indexPath = parsedPath.path + "/util/index.ts";
        const utilExport = `export * from "./${parsedPath.name}/${parsedPath.name}-util.service";`;
        rule = chain([
          rule,
          schematic("neo-service", utilServiceOptions),
          createIndex(indexPath, utilExport),
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

function createIndex(path: string, content: string): Rule {
  return (tree: Tree) => {
    tree.create(path, content);
    return tree;
  };
}
