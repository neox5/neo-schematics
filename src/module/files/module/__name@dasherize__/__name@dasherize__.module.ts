import { NgModule } from "@angular/core";
<% if(withrouting) { %>import { Routes, RouterModule } from "@angular/router"; <% } %>
import { SharedModule } from "@shared/shared.module";

import { views } from "./views";
import { containers } from "./containers";
import { components } from "./components";
<% if(withrouting) { %>
export const ROUTES: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    children: [],
  },
];
<% } %>
@NgModule({
  declarations: [...views, ...containers, ...components],
  imports: [
    <% if(withrouting) { %>RouterModule.forRoot(ROUTES, { enableTracing: false }),<% } %> 
    SharedModule
  ],
})
export class <%= classify(name)%>Module {}
