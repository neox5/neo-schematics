import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";

import { views } from "./views";
import { containers } from "./containers";
import { components } from "./components";

@NgModule({
  declarations: [...views, ...containers, ...components],
  imports: [SharedModule],
})
export class <%= classify(name) %>LayoutModule {}
