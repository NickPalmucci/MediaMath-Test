import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FruitsComponent } from './fruits/fruits.component';
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';
import { SnacksComponent } from './snacks/snacks.component';

import { D3Service } from 'd3-ng2-service';
import { DataService } from './data.service';
import { ChartsService } from './charts.service';



@NgModule({
  declarations: [
    AppComponent,
    FruitsComponent,
    HeaderComponent,
    CardComponent,
    SnacksComponent
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
