import { NgModule } from "@angular/core";
<% if(withsubrouting) { %>import { Routes, RouterModule } from "@angular/router"; <% } %>
import { SharedModule } from "@shared/shared.module";

import { views } from "./views";
import { containers } from "./containers";
import { components } from "./components";
<% if(withsubrouting) { %>
export const SUBROUTES: Routes = [
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
    <% if(withsubrouting) { %>RouterModule.forChild(SUBROUTES),<% } %> 
    SharedModule
  ],
})
export class <%= classify(name)%>Module {}
