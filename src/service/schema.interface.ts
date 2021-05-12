export type ServiceType = "" | "api" | "sandbox" | "util" ;

export interface Schema {
  name: string;
  type?: ServiceType;
  project?: string;
}