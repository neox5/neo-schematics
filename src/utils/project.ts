import {
  ProjectDefinition,
  WorkspaceDefinition,
} from "@angular-devkit/core/src/workspace";
import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { buildRootPathFromProject, getWorkspace } from "./workspace";

export function getProject(
  workspace: WorkspaceDefinition,
  projectName: string
): ProjectDefinition {
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

export function getDefaultProjectName(workspace: WorkspaceDefinition): string {
  return workspace.extensions["defaultProject"] as string;
}

export async function getRootPathFromProject(
  tree: Tree,
  pName?: string
): Promise<string> {
  const workspace = await getWorkspace(tree);

  let projectName = getDefaultProjectName(workspace);
  if (pName) {
    projectName = pName;
  }

  return buildRootPathFromProject(getProject(workspace, projectName)) + "/";
}
