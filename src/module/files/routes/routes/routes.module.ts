import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ROUTES } from "./routes";

// modules

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(ROUTES, { enableTracing: false }),
    // modules
  ],
  exports: [RouterModule],
})
export class RoutesModule {}
