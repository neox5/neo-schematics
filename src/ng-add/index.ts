import { chain, Rule, schematic } from "@angular-devkit/schematics";

import { Schema as AddSchema } from "./schema.interface";
import { Schema as InitSchema } from "../init/schema.interface";

export default function (options: AddSchema): Rule {
  return () => {
    let rule = chain([]);
    if (options.debug) {
      rule = chain([rule, schematic("debug", options)]);
    }

    const initOptions: InitSchema = {
      default: true,
      quotes: "double",
    };

    return chain([rule, schematic("neo-init", initOptions)]);
  };
}
