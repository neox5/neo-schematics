export interface Schema {
  prefix: string;
  inlinetemplate: boolean;
  pathaliases: boolean;
  quotes: string;
  allowunderscore: boolean;
  prodscript: boolean;
  includestylepath: boolean;

  stylelint: boolean;
  project?: string;
}
