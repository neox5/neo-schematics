export type ModuleType = "" | "core" | "layout" | "routing" | "shared";

export interface Schema {
  name: string;
  type?: ModuleType;
  project?: string;
}