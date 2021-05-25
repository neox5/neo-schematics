export type ComponentType = "view" | "container" | "component";

export interface Schema {
  subpath: string;
  type: ComponentType;
  skipImport?: boolean;
  template?: string;
  sandboxName?: string;
  destroyable?: boolean;
  project?: string;
  debug?: boolean;
}