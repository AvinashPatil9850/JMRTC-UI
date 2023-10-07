import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { MsrtcService } from 'src/app/services/msrtc.service';
import { BusListCellRendererComponent } from './bus-list-cell-renderer/bus-list-cell-renderer.component';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WeekdayscellrendererComponent } from './weekdayscellrenderer/weekdayscellrenderer.component';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.scss'],
})
export class BusListComponent implements OnInit {


  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  allBussessArray: any;
  gridOptions: GridOptions;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  paginationSize: number = 10;
  columnDefs: ColDef[] = [];

  public defaultColDef: ColDef = {
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };

  public rowData$: any;

  constructor(private _msertcService: MsrtcService,
    private _router: Router,
    public _navCtrl: NavController,
    private _toast: NgToastService,) {
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      // enable filtering 
      enableFilter: true
    };

  }


  ngOnInit() {
    this.getAllBusList();
  }
  //ag grid configuration starts

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
  getAllBusList() {
    this._msertcService.getAllBussess().subscribe(res => {
      this.allBussessArray = res;
      let result = this.allBussessArray.map((a: any) => a.weekDays.map((x: any) => x.abbr));
      let t = result.join('-');


      this.rowData = this.allBussessArray;
      this.setColumnHeader();
      this.gridOptions = {
        rowData: this.rowData,
        columnDefs: this.columnDefs,
        pagination: true,
        rowSelection: 'single',
        paginationPageSize: this.paginationSize,
        unSortIcon: false,
        suppressClickEdit: true
      }
    }
    )
  }
  onCellClicked($event: any) {

  }
  setColumnHeader() {
    this.columnDefs = [
      {
        headerName: 'Sr. No', valueGetter: "node.rowIndex + 1",
        width: 100,
        filter: 'agNumberColumnFilter',
        floatingFilter: true,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false
      },
      {
        headerName: 'Bus Depo', field: 'busDepo',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Bus Route', field: 'busRoute',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Bus Time', field: 'busTime',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Bus Type', field: 'busType',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Bus Via', field: 'via',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'From', field: 'source',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'To', field: 'destination',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Days', field: 'days',
        filter: 'agTextColumnFilter',
        cellRenderer: WeekdayscellrendererComponent,
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'Action', minWidth: 175, cellRenderer: BusListCellRendererComponent,
        cellRendererParams: {
          onClick: this.onBtnCellRendererClick.bind(this),
          deleteLabel: 'Delete',
          editLabel: 'Edit'
        },
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },

    ];

  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onBtnCellRendererClick(params: ICellRendererParams) {
    let data: any = params
    if (data.action == 'delete') {
      let deleteObj = {
        busID: params?.data.busID
      }
      this._msertcService.deleteBus(deleteObj).subscribe({
        next: res => {
          this.getAllBusList();
          this.gridApi.refreshCells()
          this._toast.success({ detail: "SUCCESS", summary: 'Record deleted successfulley', duration: 5000 });
        },
        error: error => {
          this._toast.error({ detail: "ERROR", summary: 'Failed To Delete', duration: 5000 });
        }
      }
      );
    }
    if (data.action == 'edit') {
      this._router.navigateByUrl('/add-bus');
    }
  }
}