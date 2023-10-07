import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-bus-list-cell-renderer',
  templateUrl: './bus-list-cell-renderer.component.html',
  styleUrls: ['./bus-list-cell-renderer.component.scss'],
})
export class BusListCellRendererComponent implements ICellRendererAngularComp {
  params: any;
  constructor(
    private _toast: NgToastService,
    private _router: Router,
  ) {

  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
  delete($event: any) {

    try {
      if (this.params.onClick instanceof Function) {
        const params = {
          event: $event,
          data: this.params.node.data,
          action: 'delete'
        }
        this.params.onClick(params);

      }
    }
    catch (error) {
      if (error instanceof Error) {
        this._toast.error({ detail: "Error", summary: error.message, duration: 5000 });
      }
    }
  }
  edit($event: any) {
    try {
      if (this.params.onClick instanceof Function) {
        const params = {
          event: $event,
          data: this.params.node.data,
          action: 'edit'
        }
        this.params.onClick(params);
      }
    }
    catch (error) {
      if (error instanceof Error) {
        this._toast.error({ detail: "Error", summary: error.message, duration: 5000 });
      }
    }
  }



}
