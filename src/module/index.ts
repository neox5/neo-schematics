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
import { ModuleType, Schema as ModuleSchema } from "./schema.interface";

export default function (options: ModuleSchema): Rule {
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
      case "core":
        break;
      case "layout":
        const subPath = parsedPath.path.replace(project.sourceRoot as string + "/app", "");
        
        const layoutViewComponentOptions = {
          name: `${subPath}/${parsedPath.name}-layout/views/${parsedPath.name}-layout-view`,
          type: "view",
          template: layoutViewComponentTemplate(project.prefix as string),
          destroyable: false,
          project: projectName,
        };
        const navigationComponentOptions = {
          name: `${subPath}/${parsedPath.name}-layout/containers/${parsedPath.name}-navigation`,
          type: "container",
          destroyable: false,
          project: projectName,
        };

        rule = chain([
          rule,
          schematic("neo-component", layoutViewComponentOptions),
          schematic("neo-component", navigationComponentOptions),
        ]);
    }

    return rule
  };
}

function getTemplateUrl(type?: ModuleType): string {
  switch (type) {
    case "core":
      return "./files/core";
    case "layout":
      return "./files/layout";
    case "routes":
      return "./files/routes";
    case "shared":
      return "./files/shared";
    default:
      return "./files/module";
  }
}

function layoutViewComponentTemplate(prefix: string): string {
  return `<${prefix}-navigation></${prefix}-navigation>\n\t\t<router-outlet></router-outlet>`;
}
