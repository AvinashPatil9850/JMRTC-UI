import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-weekdayscellrenderer',
  templateUrl: './weekdayscellrenderer.component.html',
  styleUrls: ['./weekdayscellrenderer.component.scss'],
})
export class WeekdayscellrendererComponent implements ICellRendererAngularComp {
  params: any;
  weekDaysList: any;
  isShow = false;
  constructor(
    private _toast: NgToastService,
  ) {

  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
    if (this.params.data.weekDays.length > 0) {
      this.isShow = true;
      this.weekDaysList = this.params.data.weekDays;
    } else {
      this.isShow = false;
    }
  }

  refresh(params: ICellRendererParams) {
    this.params = params;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }
}
