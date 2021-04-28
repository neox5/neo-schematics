import { Routes } from "@angular/router";

// layout
import { LayoutViewComponent } from "@layout/views";

// views

// =============================================================================
//
// ROUTES
//
// =============================================================================
export const ROUTES: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    component: LayoutViewComponent,
    children: [],
  },
];
