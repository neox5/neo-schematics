import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AppLayoutViewComponent } from "@layouts/app-layout/views";

export const ROUTES: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    component: AppLayoutViewComponent,
    children: [],
  },
];

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
