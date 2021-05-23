import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

import { Schema as InitOptions } from "./schema.interface";
import {
  getJson,
  getDefaultProjectName,
  getWorkspace,
  getProject,
  getFile,
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
      // console.warn(
      //   "Neo Schematics currently supports inline templates only! \n\t $ ng generate neo-init --inlinetemplates"
      // );
      // throw new SchematicsException(
      //   "Neo Schematics currently supports inline templates only!"
      // );
    }

    if (options.pathaliases) {
      console.warn(
        "This works only for single project workspaces at the moment."
      );
      const tsconfig = getJson(tree, "tsconfig.json");
      tsconfig.compilerOptions.baseUrl = project.sourceRoot;
      tsconfig.compilerOptions["paths"] = {};
      tsconfig.compilerOptions["paths"]["@assets/*"] = ["assets/*"];
      tsconfig.compilerOptions["paths"]["@core/*"] = ["app/core/*"];
      tsconfig.compilerOptions["paths"]["@layout/*"] = ["app/layout/*"];
      tsconfig.compilerOptions["paths"]["@routes/*"] = ["app/routes/*"];
      tsconfig.compilerOptions["paths"]["@shared/*"] = ["app/shared/*"];
      tsconfig.compilerOptions["paths"]["@env/*"] = ["environments/*"];

      tree.overwrite("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    }

    if (options.quotes == "single" || options.quotes == "double") {
      let editorConfig = getFile(tree, ".editorconfig");
      const quoteRegex = /quote_type\s*=\s*(?:double|single)/gm;
      const newSetting = `quote_type = ${options.quotes}`;

      editorConfig = editorConfig.replace(quoteRegex, newSetting);
      tree.overwrite(".editorconfig", editorConfig);
    }

    if (options.prodscript) {
      const packageJson = getJson(tree, "package.json");
      packageJson.scripts["prod"] = "ng build --configuration production";
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
