import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const ROUTES: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    children: [],
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(ROUTES, { enableTracing: false })
  ],
  exports: [RouterModule],
})
export class <%= classify(name) %>RoutingModule {}
