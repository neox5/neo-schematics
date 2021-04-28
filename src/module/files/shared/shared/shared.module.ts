import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { views } from "./views";
import { containers } from "./containers";
import { components } from "./components";
import { directives } from "./directives";
import { pipes } from "./pipes";


@NgModule({
  declarations: [
    ...views,
    ...containers,
    ...components,
    ...directives,
    ...pipes,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ...views,
    ...containers,
    ...components,
    ...directives,
    ...pipes,
  ],
})
export class SharedModule {}
