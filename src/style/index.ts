import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  schematic,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { getSrcPathFromProject } from "../utils";
import { Schema as StyleSchema } from "./schema.interface";
import { Schema as InitSchema } from "../init/schema.interface";

export default function (options: StyleSchema): Rule {
  return async (tree: Tree) => {
    let rule = chain([]);
    if (options.debug) {
      rule = chain([rule, schematic("debug", options)]);
    }

    const srcPath = await getSrcPathFromProject(tree, options.project);

    tree.delete(srcPath + "styles.scss");

    const sourceTemplates = apply(url("./files"), [move(srcPath)]);

    const initOptions: InitSchema = {
      includestylepath: true,
    };

    return chain([
      rule,
      mergeWith(sourceTemplates),
      schematic("neo-init", initOptions),
    ]);
  };
}
