import { Rule, Tree } from "@angular-devkit/schematics";
import { tsquery } from "@phenomnomnominal/tsquery";
import { InsertChange } from "@schematics/angular/utility/change";
import { readIntoSourceFile } from "./read-into-source-file";
import { applyToUpdateRecorder } from "./recorder-util";

export function addImport(
  filePath: string,
  symbolName: string,
  symbolFilePath: string
): Rule {
  return (tree: Tree) => {
    const sourceFile = readIntoSourceFile(tree, filePath);
    const importNodes = tsquery(sourceFile, "ImportDeclaration");

    const isBeginning = importNodes.length == 0;

    if (isBeginning) {
      // create first import
      const toInsert = `import { ${symbolName} } from "${symbolFilePath}";\n\n`;

      const recorder = tree.beginUpdate(filePath);
      const pos = 0; // beginning of file
      const change = new InsertChange(filePath, pos, toInsert);
      applyToUpdateRecorder(recorder, [change]);
      tree.commitUpdate(recorder);

      return tree;
    }

    // check if importPath already exists
    const node = importNodes.find((n) => {
      const importPath = tsquery(n, "StringLiteral")[0].getText();
      return importPath.replace(/["']/g, "") === symbolFilePath;
    });

    if (node) {
      // import path already exist
      // add symbolName to import declaration
      const importSpecifier = tsquery(node, "ImportSpecifier");
      const pos = importSpecifier[importSpecifier.length - 1].getEnd();

      const recorder = tree.beginUpdate(filePath);
      const change = new InsertChange(filePath, pos, ", " + symbolName);
      applyToUpdateRecorder(recorder, [change]);
      tree.commitUpdate(recorder);

      return tree;
    }

    // add after last import statement
    const pos = importNodes[importNodes.length - 1].getEnd(); // after last import

    const separator = ";\n";   // this fixes the issue that the insert happens before the previous semicolon
    const lineEnd = "";        // for that reason we do not add a semicolon to the end
    const toInsert = `${separator}import { ${symbolName} } from "${symbolFilePath}"${lineEnd}`;

    const recorder = tree.beginUpdate(filePath);
    const change = new InsertChange(filePath, pos, toInsert);
    applyToUpdateRecorder(recorder, [change]);
    tree.commitUpdate(recorder);

    return tree;
  };
}
