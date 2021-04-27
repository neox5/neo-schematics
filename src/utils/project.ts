import { ProjectDefinition, WorkspaceDefinition } from "@angular-devkit/core/src/workspace";
import { SchematicsException } from "@angular-devkit/schematics";

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