import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { layouts } from "@layouts/index";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
