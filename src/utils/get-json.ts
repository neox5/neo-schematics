import { Tree, SchematicsException } from "@angular-devkit/schematics";
import * as stripJsonComments from "strip-json-comments";

export function getJson(tree: Tree, jsonPath: string): any {
  const jsonBuffer = tree.read(jsonPath);
  if (jsonBuffer === null) {
    throw new SchematicsException(`Could not find ${jsonPath}`);
  }

  const json = jsonBuffer.toString();
  
  return JSON.parse(stripJsonComments(json));
}