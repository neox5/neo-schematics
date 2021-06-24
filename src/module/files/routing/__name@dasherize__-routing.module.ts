import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

export const <% if(forroot) { %>ROUTES<% } else%>SUBROUTES<% } %>: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    children: [],
  },
];

@NgModule({
  declarations: [],
  imports: [
    <% if(forroot) { %>RouterModule.forRoot(ROUTES, { enableTracing: false })<% } else%>RouterModule.forChild(SUBROUTES)<% } %>
  ],
  exports: [RouterModule],
})
export class <%= classify(name) %>RoutingModule {}
