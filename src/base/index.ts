import { apply, chain, MergeStrategy, mergeWith, move, Rule, schematic, template, Tree, url } from '@angular-devkit/schematics';

import { Schema as AddSchema } from "./schema.interface";
import { Schema as InitSchema } from "../init/schema.interface";
import { Schema as ModuleSchema } from "../module/schema.interface";
import { getPrefix, getRootPathFromProject } from '../utils';

export default function (options: AddSchema): Rule {
  return async (tree: Tree) => {
    let rule = chain([]);
    if (options.debug) {
      rule = chain([rule, schematic("debug", options)]);
    }

    const initOptions: InitSchema = {
      pathaliases: true,
      project: options.project
    }

    const coreModuleOptions: ModuleSchema = {
      subpath: "core",
      type: "core",
      project: options.project
    }
    
    const sharedModuleOptions: ModuleSchema = {
      subpath: "shared",
      type: "shared",
      project: options.project  
    }

    const layoutModuleOptions: ModuleSchema = {
      subpath: "layouts/main",
      type: "layout",
      project: options.project
    }

    const routesModuleOptions: ModuleSchema = {
      subpath: "routes/app",
      type: "routing",
      project: options.project
    }

    const rootPath = await getRootPathFromProject(tree, options.project);
    const prefix = await getPrefix(tree, options.project);
    // add template
    const sourceTemplates = url("./files");
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({ prefix }),
      move(rootPath),
    ]);

    if (tree.exists("./src/app/app.component.html")) {
      tree.delete("./src/app/app.component.html");
    }

    return chain([
      rule,
      schematic("neo-init", initOptions),
      schematic("neo-module", coreModuleOptions),
      schematic("neo-module", sharedModuleOptions),
      schematic("neo-module", layoutModuleOptions),
      schematic("neo-module", routesModuleOptions),
      mergeWith(sourceParametrizedTemplates, MergeStrategy.Overwrite)
    ])
  };
}
