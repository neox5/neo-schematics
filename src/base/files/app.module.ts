import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { CoreModule } from "@core/core.module";
import { MainLayoutModule } from "@layouts/main-layout/main-layout.module";
import { AppRoutingModule } from "@routes/app-routing.module";

import { AppComponent } from "./app.component";

import "@angular/common/locales/global/de-AT";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CoreModule, MainLayoutModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
