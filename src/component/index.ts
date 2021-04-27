import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
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

    return chain([mergeWith(sourceParametrizedTemplates)]);
  };
}
