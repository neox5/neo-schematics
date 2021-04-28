export type ModuleType = "" | "core" | "layout" | "routes" | "shared";

export interface Schema {
  name: string;
  type?: ModuleType;
  project?: string;
}