export type ServiceType = "" | "api" | "sandbox" | "util" ;

export interface Schema {
  subpath:string;
  type?: ServiceType;
  skiputil?: boolean;
  skipimport?: boolean;
  project?: string;
}