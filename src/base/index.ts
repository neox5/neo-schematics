import { chain, Rule, schematic } from '@angular-devkit/schematics';

import { Schema as AddSchema } from "./schema.interface";
import { Schema as InitSchema } from "../init/schema.interface";
import { Schema as ModuleSchema } from "../module/schema.interface";

export default function (options: AddSchema): Rule {
  return () => {
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
      subpath: "layouts/app",
      type: "layout",
      project: options.project
    }

    const routesModuleOptions: ModuleSchema = {
      subpath: "routes/app",
      type: "routing",
      project: options.project
    }

    return chain([
      rule,
      schematic("neo-init", initOptions),
      schematic("neo-module", coreModuleOptions),
      schematic("neo-module", sharedModuleOptions),
      schematic("neo-module", layoutModuleOptions),
      schematic("neo-module", routesModuleOptions),
    ])
  };
}
