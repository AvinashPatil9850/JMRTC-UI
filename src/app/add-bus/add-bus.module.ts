import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBusPageRoutingModule } from './add-bus-routing.module';

//import { AddBusPage } from './add-bus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBusPageRoutingModule
  ],
  declarations: [
    //  AddBusPage
  ]
})
export class AddBusPageModule { }
