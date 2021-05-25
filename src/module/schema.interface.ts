export type ModuleType = "" | "core" | "layout" | "routing" | "shared";

export interface Schema {
  subpath: string;
  type?: ModuleType;
  project?: string;
  skipview?: boolean;
  debug?: boolean;
}