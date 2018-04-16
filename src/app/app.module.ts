import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule }    from '@angular/common/http';
import { AppComponent } from './app.component';
import { Histogram } from './histogram/histo.component';

import { D3Service } from 'd3-ng2-service';
import { DataService } from './data.service';

import { ChartsService } from './charts.service';


@NgModule({
  declarations: [
    AppComponent,
    Histogram
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [D3Service, DataService, ChartsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
