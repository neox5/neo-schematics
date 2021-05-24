import { Rule, Tree } from "@angular-devkit/schematics";
import { getPrefix, getRootPathFromProject, splitSubpath } from "../utils";

export default function (options: any): Rule {
  return async (tree: Tree) => {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+                          DEBUG                           +");
    console.log("+                                                          +");
    console.log("options:");
    console.log(JSON.stringify(options, null, 2));
    
    if (options.project) {
      const rootPath = await getRootPathFromProject(tree, options.project);
      const prefix = await getPrefix(tree, options.project);
      console.log("rootPath:", rootPath);
      console.log("prefix:", prefix);
    }
    
    if (options.subpath) {
      const { symbolDir, symbolName } = splitSubpath(options.subpath);
      console.log("symbolDir:", symbolDir);
      console.log("symbolName:", symbolName);
    }

    console.log("+                                                          +");
    console.log("+                           END                            +");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("\n");
    return;
  };
}
