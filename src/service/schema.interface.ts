export type ServiceType = "" | "api" | "sandbox" | "util" ;

export interface Schema {
  subpath:string;
  type?: ServiceType;
  skipUtil?: boolean;
  project?: string;
}