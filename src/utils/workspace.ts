import { SchematicsException, Tree } from "@angular-devkit/schematics";
import { virtualFs, workspaces } from "@angular-devkit/core";

export enum ProjectType {
  Application = "application",
  Library = "library",
}

function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException("File not found.");
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

export async function getWorkspace(
  tree: Tree,
  path = "/"
): Promise<workspaces.WorkspaceDefinition> {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace(path, host);

  return workspace;
}

export function buildDefaultPath(
  project: workspaces.ProjectDefinition
): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;
  const projectDirName =
    project.extensions["projectType"] === ProjectType.Application
      ? "app"
      : "lib";

  return `${root}${projectDirName}`;
}

export function buildRootPathFromProject(
  project: workspaces.ProjectDefinition
): string {
  const root = project.sourceRoot
    ? `/${project.sourceRoot}/`
    : `/${project.root}/src/`;
  const projectDirName =
    project.extensions["projectType"] === ProjectType.Application
      ? "app"
      : "lib";

  return `${root}${projectDirName}`;
}