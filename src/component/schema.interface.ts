export type ComponentType = "view" | "container" | "component";

export interface Schema {
  name: string;
  type: ComponentType;
  skipImport: boolean;
  path?: string;
  prefix?: string;
  quotes?: "single" | "double",
  template?: string;
  sandboxName?: string;
  destroyable?: boolean;
  project?: string;
}