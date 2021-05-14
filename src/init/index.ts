import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

import { Schema as InitOptions } from "./schema.interface";
import {
  getJson,
  getDefaultProjectName,
  getWorkspace,
  getProject,
} from "../utils";

export default function (options: InitOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const workspace = await getWorkspace(tree);

    let projectName = getDefaultProjectName(workspace);
    if (options.project) {
      projectName = options.project;
    }

    const project = getProject(workspace, projectName);

    if (options.prefix != "") {
      const angularJson = getJson(tree, "angular.json");
      angularJson.projects[projectName].prefix = options.prefix;
      tree.overwrite("angular.json", JSON.stringify(angularJson, null, 2));
    }

    if (options.inlinetemplate) {
      const angularJson = getJson(tree, "angular.json");
      const rules =
        angularJson.projects[projectName]["schematics"][
          "@schematics/angular:component"
        ];
      angularJson.projects[projectName]["schematics"][
        "@schematics/angular:component"
      ] = {
        ...rules,
        inlineTemplate: true,
      };

      tree.overwrite("angular.json", JSON.stringify(angularJson, null, 2));
    } else {
      console.warn(
        "Neo Schematics currently supports inline templates only! \n\t $ ng generate neo-init --inlinetemplates"
      );
      // throw new SchematicsException(
      //   "Neo Schematics currently supports inline templates only!"
      // );
    }

    if (options.pathaliases) {
      const tsconfig = getJson(tree, project.root + "/tsconfig.app.json");
      tsconfig.compilerOptions.baseUrl = "./src";
      tsconfig.compilerOptions["paths"] = {};
      tsconfig.compilerOptions["paths"]["@assets/*"] = ["assets/*"];
      tsconfig.compilerOptions["paths"]["@core/*"] = ["app/core/*"];
      tsconfig.compilerOptions["paths"]["@layout/*"] = ["app/layout/*"];
      tsconfig.compilerOptions["paths"]["@routes/*"] = ["app/routes/*"];
      tsconfig.compilerOptions["paths"]["@shared/*"] = ["app/shared/*"];
      tsconfig.compilerOptions["paths"]["@env/*"] = ["environments/*"];
      tree.overwrite(
        project.root + "/tsconfig.app.json",
        JSON.stringify(tsconfig, null, 2)
      );
    }

    if (options.quotes == "single" || options.quotes == "double") {
      const tslint = getJson(tree, "tslint.json");
      tslint.rules.quotemark = [true, options.quotes];
      tree.overwrite("tslint.json", JSON.stringify(tslint, null, 2));
    }

    if (options.allowunderscore) {
      // tree.overwrite should only be envoked when an update happend
      const tslint = getJson(tree, project.root + "/tslint.json");
      const rules = tslint["rules"];

      // check if variable-name rules exists
      if (tslint["rules"]["variable-name"]) {
        const opts = tslint["rules"]["variable-name"]["options"];
        // check if optoin is already added
        if (opts.indexOf("allow-leading-underscore") === -1) {
          tslint["rules"]["variable-name"]["options"] = [
            ...opts,
            "allow-leading-underscore",
          ];
          tree.overwrite(
            project.root + "/tslint.json",
            JSON.stringify(tslint, null, 2)
          );
        }
      } else {
        tslint["rules"] = {
          ...rules,
          "variable-name": {
            options: ["allow-leading-underscore"],
          },
        };
        tree.overwrite(
          project.root + "/tslint.json",
          JSON.stringify(tslint, null, 2)
        );
      }
    }

    if (options.prodscript) {
      const packageJson = getJson(tree, "package.json");
      packageJson.scripts["prod"] = "ng build --prod";
      tree.overwrite("package.json", JSON.stringify(packageJson, null, 2));
    }

    if (options.includestylepath) {
      const angularJson = getJson(tree, "angular.json");
      const opt =
        angularJson["projects"][projectName]["architect"]["build"]["options"];
      angularJson["projects"][projectName]["architect"]["build"]["options"] = {
        ...opt,
        stylePreprocessorOptions: {
          includePaths: ["src/styles/scss"],
        },
      };
      tree.overwrite("angular.json", JSON.stringify(angularJson, null, 2));
    }

    return;
  };
}
