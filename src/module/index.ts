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
  addImport,
  appendIndexExportArray,
  findIndexFromPath,
  getPrefix,
  getRootPathFromProject,
  splitSubpath,
} from "../utils";
import { ModuleType, Schema as ModuleSchema } from "./schema.interface";
import { Schema as ComponentSchema } from "../component/schema.interface";

export default function (options: ModuleSchema): Rule {
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

    switch (options.type) {
      case "":
        if (options.skipview) {
          break;
        }
        
        const viewComponentOptions: ComponentSchema = {
          subpath: `${symbolDir}/${symbolName}/views/${symbolName}`,
          type: "view",
          destroyable: false,
          project: options.project,
        };

        rule = chain([rule, schematic("neo-component", viewComponentOptions)]);
        break;
      case "core":
        break;
      case "layout":
        const prefix = await getPrefix(tree, options.project);
        const layoutViewComponentOptions: ComponentSchema = {
          subpath: `${symbolDir}/${symbolName}-layout/views/${symbolName}-layout-view`,
          type: "view",
          template: layoutViewComponentTemplate(prefix, symbolName),
          destroyable: false,
          project: options.project,
        };
        const navigationComponentOptions: ComponentSchema = {
          subpath: `${symbolDir}/${symbolName}-layout/containers/${symbolName}-navigation`,
          type: "container",
          destroyable: false,
          project: options.project,
        };

        rule = chain([
          rule,
          addModuleImport(rootPath + symbolDir, symbolName + "-layout"),
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

function layoutViewComponentTemplate(prefix: string, symbolName: string): string {
  return `<${prefix}-${symbolName}-navigation></${prefix}-${symbolName}-navigation>\n\t\t<router-outlet></router-outlet>`;
}

function addModuleImport(path: string, moduleSymbol: string): Rule {
  return (tree: Tree) => {
    let rule: Rule = noop();
    let indexPath = findIndexFromPath(tree, path);
    if (indexPath == undefined) {
      const sourceTemplates = url("./files/layout/index");
      const sourceParametrizedTemplates = apply(sourceTemplates, [move(path)]);
      rule = mergeWith(sourceParametrizedTemplates);
      indexPath = path + "/index.ts";
    }

    const moduleName = `${strings.classify(moduleSymbol)}Module`;
    const moduleFilePath = "./" + moduleSymbol + "/" + moduleSymbol + ".module";

    return chain([
      rule,
      addImport(indexPath, moduleName, moduleFilePath),
      appendIndexExportArray(indexPath, moduleName),
    ]);
  };
}
