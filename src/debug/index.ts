import { strings } from "@angular-devkit/core";
import {
  apply,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { getProject } from "../utils/project";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function debug(options: any): Rule {
  return async (tree: Tree) => {
    const project = await getProject(tree, options.project);

    const projectPath = project.sourceRoot as string;
    console.log(projectPath + "/.npmrc");
    const token = "0fbdf392-03f2-4299-8311-328a45d9c736";
    const parametrizedTemplate = apply(url("./files"), [
      template({ ...strings, token }),
      move(projectPath),
    ]);

    return mergeWith(parametrizedTemplate);
  };
}
