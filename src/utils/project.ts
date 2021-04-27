import { ProjectDefinition } from "@angular-devkit/core/src/workspace";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { getWorkspace } from "./workspace";

export async function getProject(
  tree: Tree,
  projectName: string
): Promise<ProjectDefinition> {
  const workspace = await getWorkspace(tree);

  if (!projectName) {
    throw new SchematicsException("Project is not defined in this workspace.");
  }

  const project = workspace.projects.get(projectName);
  if (!project) {
    throw new SchematicsException(
      `Project ${projectName} is not defined in this workspace.`
    );
  }

  return project;
}

export async function getDefaultProjectName(tree: Tree): Promise<string> {
  const workspace = await getWorkspace(tree);
  return workspace.extensions["defaultProject"] as string;
}