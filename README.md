<!--
  TEMPLATE: https://raw.githubusercontent.com/spf13/cobra/master/README.md
-->
<p align="center">
  <a href="https://www.npmjs.com/package/@neox/schematics">
    <img src="https://i.imgur.com/LQj7j89.png">
  </a>
</p>


<!-- omit in toc -->
# Neo Angular Schematics

Angular schematics for a faster and scalable code generation.

## Usage

```shell
# create new angular/cli workspace
ng new ng-workspace --create-application=false
cd ng-workspace

# create new angular/cli project
ng generate application app-one

# add eslint (for more details: https://github.com/angular-eslint/angular-eslint)
ng add @angular-eslint/schematics

# change cli default schematics collection (angular.json/cli.defaultCollection)
```