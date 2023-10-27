import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddBusPage } from './add-bus/add-bus.page';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule } from '@angular/material/select';
import { BusListComponent } from './add-bus/bus-list/bus-list.component';
import { BusListCellRendererComponent } from './add-bus/bus-list/bus-list-cell-renderer/bus-list-cell-renderer.component';
import { NgToastModule } from 'ng-angular-popup';
import { DestinationListComponent } from './add-bus/destination-list/destination-list.component';
import { StopsListComponent } from './add-bus/stops-list/stops-list.component';
import { WeekdayscellrendererComponent } from './add-bus/bus-list/weekdayscellrenderer/weekdayscellrenderer.component';
import { DepoListComponent } from './add-bus/depo-list/depo-list.component';

@NgModule({
  declarations: [AppComponent, AddBusPage, BusListComponent,
    DestinationListComponent,
    StopsListComponent,
    DepoListComponent,
    BusListCellRendererComponent,
    WeekdayscellrendererComponent],

  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AccordionModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgToastModule,
    AgGridModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
