import { Rule, SchematicsException, Tree } from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import { InsertChange } from "@schematics/angular/utility/change";
import { readIntoSourceFile } from "./read-into-source-file";
import { applyToUpdateRecorder } from "./recorder-util";

export function addToConstructor(
  filePath: string,
  varName: string,
  symbolName: string
): Rule {
  return (tree: Tree) => {
    const sourceFile = readIntoSourceFile(tree, filePath);
    const constructorParameters = tsquery(
      sourceFile,
      "Constructor > Parameter"
    );
    const constructorBlock = tsquery(sourceFile, "Constructor > Block")[0];

    if (!constructorBlock) {
      throw new SchematicsException(`Constructor missing in: ${filePath}`);
    }

    let toInsert = `private ${varName}: ${symbolName}`;
    const pos = constructorBlock.pos - 1;

    if (constructorParameters.length != 0) {
      toInsert = ", " + toInsert;
    }
    
    const change = new InsertChange(filePath, pos, toInsert);
    const recorder = tree.beginUpdate(filePath);
    applyToUpdateRecorder(recorder, [change]);
    tree.commitUpdate(recorder);

    return tree;
  };
}
