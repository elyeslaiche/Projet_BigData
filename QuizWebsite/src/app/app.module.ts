import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarplotComponent } from './stats/barplot/barplot.component';
import { GaugeComponent } from './stats/gauge/gauge.component';
import { LineComponent } from './stats/line/line.component';
import { PieComponent } from './stats/pie/pie.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
