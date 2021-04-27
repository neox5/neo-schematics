import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from "@angular-devkit/schematics";

import { Schema as InitOptions } from "./schema.interface";
import { getJson, getDefaultProjectName } from "../utils";

export default function (options: InitOptions): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    const angularJson = getJson(tree, "angular.json");
    // const tslint = getJson(tree, "tslint.json");
    // const tsconfig = getJson(tree, "tsconfig.json");
    // const packageJson = getJson(tree, "package.json");

    let projectName = await getDefaultProjectName(tree);
    if (options.project) {
      projectName = options.project;
    }

    console.log(options);

    // const project = await getProject(tree, projectName);

    // modify angular.json
    if (options.prefix) {
      angularJson.projects[projectName].prefix = options.prefix;
    }

    if (options.inlineTemplate) {
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
    } else {
      throw new SchematicsException(
        "Neo Schematics currently supports inline templates only!"
      );
    }

    // const opt = workspace["projects"][pn]["architect"]["build"]["options"];
    // workspace["projects"][pn]["architect"]["build"]["options"] = {
    //   ...opt,
    //   stylePreprocessorOptions: {
    //     includePaths: ["src/styles/scss"],
    //   },
    // };

    // // modify tslint.json
    // tslint.rules.quotemark = [true, _options.quotes];

    // let current = tslint["rules"]["no-inferrable-types"];
    // if (current.indexOf("no-inferrable-types") === -1) {
    //   tslint["rules"]["no-inferrable-types"] = [
    //     ...current,
    //     "ignore-properties",
    //   ];
    // }

    // current = tslint["rules"]["variable-name"]["options"];
    // if (current.indexOf("allow-leading-underscore") === -1) {
    //   tslint["rules"]["variable-name"]["options"] = [
    //     ...current,
    //     "allow-leading-underscore",
    //   ];
    // }

    // // modify tsconfig.base.json
    // tsconfig.compilerOptions.baseUrl = "./src";
    // tsconfig.compilerOptions["paths"] = {};
    // tsconfig.compilerOptions["paths"]["@assets/*"] = ["assets/*"];
    // tsconfig.compilerOptions["paths"]["@core/*"] = ["app/core/*"];
    // tsconfig.compilerOptions["paths"]["@layout/*"] = ["app/layout/*"];
    // tsconfig.compilerOptions["paths"]["@routes/*"] = ["app/routes/*"];
    // tsconfig.compilerOptions["paths"]["@shared/*"] = ["app/shared/*"];
    // tsconfig.compilerOptions["paths"]["@env/*"] = ["environments/*"];

    // // adds prod script to package.json
    // packageJson.scripts["prod"] = "ng build --prod";

    // overwrite config files
    tree.overwrite("angular.json", JSON.stringify(angularJson, null, 2));
    // tree.overwrite("tslint.json", JSON.stringify(tslint, null, 2));
    // tree.overwrite("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    // tree.overwrite("package.json", JSON.stringify(packageJson, null, 2));

    // modify editorconfig
    // tree.delete(".editorconfig"); // workaround
    // const parametrizedConfig = apply(url("./files/editorconfig"), [
    //   template({ quotes: _options.quotes }),
    // ]);

    // // add neo styles
    // if (_options.styles) {
    //   rule = chain([rule, schematic("nst", _options)]);
    // }

    // // add neo stylelint
    // if (_options.stylelint) {
    //   rule = chain([rule, schematic("nslint", _options)]);
    // }

    return;
  };
}
