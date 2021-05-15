import { chain, Rule, schematic } from '@angular-devkit/schematics';

import { Schema as AddSchema } from "./schema.interface";
import { Schema as ModuleSchema } from "../module/schema.interface";

export default function (options: AddSchema): Rule {
  return () => {
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
      subpath: "layout",
      type: "layout",
      project: options.project
    }

    const routesModuleOptions: ModuleSchema = {
      subpath: "routes/app",
      type: "routing",
      project: options.project
    }

    return chain([
      schematic("neo-module", coreModuleOptions),
      schematic("neo-module", sharedModuleOptions),
      schematic("neo-module", layoutModuleOptions),
      schematic("neo-module", routesModuleOptions),
    ])
  };
}
