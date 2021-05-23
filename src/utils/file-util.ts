import { Tree, SchematicsException } from "@angular-devkit/schematics";
import * as stripJsonComments from "strip-json-comments";

export function getFile(tree: Tree, filePath: string): string {
  const fileBuffer = tree.read(filePath);
  if (fileBuffer === null) {
    throw new SchematicsException(`Could not find ${filePath}`);
  }

  return fileBuffer.toString();
}

export function getJson(tree: Tree, jsonPath: string): any {
  const json = getFile(tree, jsonPath);
  
  return JSON.parse(stripJsonComments(json));
}