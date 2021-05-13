import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  noop,
  Rule,
  schematic,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import {
  addImportToIndex,
  appendIndexExportArray,
  buildDefaultPath,
  findIndexFromPath,
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
      move(parsedPath.dir),
    ]);

    let rule = mergeWith(sourceParametrizedTemplates);

    switch (options.type) {
      case "core":
        break;
      case "layout":
        const subPath = parsedPath.dir.replace(
          (project.sourceRoot as string) + "/app",
          ""
        );

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
          addImport(parsedPath.dir, parsedPath.name + "-layout"),
          schematic("neo-component", layoutViewComponentOptions),
          schematic("neo-component", navigationComponentOptions),
        ]);
    }

    return rule;
  };
}

function getTemplateUrl(type?: ModuleType): string {
  switch (type) {
    case "core":
      return "./files/core";
    case "layout":
      return "./files/layout/module";
    case "routing":
      return "./files/routing";
    case "shared":
      return "./files/shared";
    default:
      return "./files/module";
  }
}

function layoutViewComponentTemplate(prefix: string): string {
  return `<${prefix}-navigation></${prefix}-navigation>\n\t\t<router-outlet></router-outlet>`;
}

function addImport(path: string, moduleSymbol: string): Rule {
  return (tree: Tree) => {
    let rule: Rule = noop();
    let indexPath = findIndexFromPath(tree, path);
    if (indexPath == undefined) {
      const sourceTemplates = url("./files/layout/index");
      const sourceParametrizedTemplates = apply(sourceTemplates, [move(path)]);

      rule = mergeWith(sourceParametrizedTemplates);
      indexPath = path + "/index.ts";
    }

    console.log(path);
    console.log(indexPath);
    console.log(moduleSymbol);

    const moduleName = `${strings.classify(moduleSymbol)}Module`;
    const moduleFilePath = "./" + moduleSymbol + "/" + moduleSymbol + ".module";

    return chain([
      rule,
      addImportToIndex(indexPath, moduleName, moduleFilePath),
      appendIndexExportArray(indexPath, moduleName),
    ]);
  };
}
