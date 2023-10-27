import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { NgToastService } from 'ng-angular-popup';
import { MsrtcService } from 'src/app/services/msrtc.service';
import { BusListCellRendererComponent } from '../bus-list/bus-list-cell-renderer/bus-list-cell-renderer.component';
import { IonModal } from '@ionic/angular';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stops-list',
  templateUrl: './stops-list.component.html',
  styleUrls: ['./stops-list.component.scss'],
})
export class StopsListComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  gridOptions: GridOptions;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  paginationSize: number = 10;
  columnDefs: ColDef[] = [];
  depoList: any;
  constructor(private _msertcService: MsrtcService,
    private fb: FormBuilder,
    private _toast: NgToastService,) {
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      // enable filtering 
      enableFilter: true
    };

  }


  ngOnInit() {
    this.getAllRouteStopsList();
    this.addStopsOnInit();
    //this.getAllDestination();
    this.getAllDepoList();
  }
  //ag grid configuration starts

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
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }

  getAllRouteStopsList() {
    this._msertcService.getAllStopsList().subscribe({
      next: (res: any) => {
        this.getAllStopsListArray = res;
        this.rowData = this.getAllStopsListArray;
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
      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get', duration: 5000 });
      }
    });
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
        headerName: 'Stop Name', field: 'stopName',
        filter: 'agTextColumnFilter',
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
        stopID: params?.data.stopID
      }
      this._msertcService.deleteStop(deleteObj).subscribe({
        next: res => {
          this.getAllRouteStopsList();
          this.gridApi.refreshCells()
          this._toast.success({ detail: "SUCCESS", summary: 'Record deleted successfulley', duration: 5000 });
        },
        error: error => {
          this._toast.error({ detail: "ERROR", summary: 'Failed To Delete', duration: 5000 });
        }
      }
      );
    }
  }


  //stop modal
  filteredStopsArray: any;
  addStopsForm: FormGroup;
  getAllStopsListArray: any;
  sourceModel: string;
  destinationModel: string;
  getDestinationArray: any;

  addStopsOnInit() {
    this.addStopsForm = this.fb.group({
      busDepo: ['', Validators.required],
      destination: ['', Validators.required],
      source: ['', Validators.required],
      stopsList: new FormArray([
        new FormGroup({
          stopName: new FormControl('', Validators.required),
        })
      ])
    });
    this.getAllRouteStopsList();
  }
  getAllDestination(busDepo: any) {
    debugger
    this._msertcService.getAllDestination().subscribe(res => {
      let desination: any
      desination = res;
      this.getDestinationArray = desination.filter((x: any) => x.busDepo == busDepo.value)
    })
  }
  get stopsList(): FormArray {
    return this.addStopsForm.get('stopsList') as FormArray;
  }
  addStopsInput() {
    this.stopsList.push(new FormGroup({
      stopName: new FormControl('', Validators.required),
    }))
  }
  removeStops() {
    if (this.stopsList.length > 0)
      this.stopsList.removeAt(this.stopsList.length - 1);
  }
  deleteThisStop(i: any) {
    this.stopsList.removeAt(i);
  }

  confirmAddStops() {
    this._msertcService.addStops(this.addStopsForm.value).subscribe({
      next: res => {
        this.modal.dismiss('confirm', 'cancel');
        // this.getAllStops();
        this.getAllRouteStopsList();
        this._toast.success({ detail: "SUCCESS", summary: 'Stops Added successfulley', duration: 5000 });
      },
      error: error => {
        this.modal.dismiss('confirm', 'modal1');
        this._toast.error({ detail: "ERROR", summary: 'Failed To Add', duration: 5000 });
      }
    })
  }
  // getAllStops() {
  //   this._msertcService.getAllStopsList().subscribe({
  //     next: res => {
  //       this.getAllStopsListArray = res;
  //     },
  //     error: error => {
  //       this.modal.dismiss('confirm', 'cancel');
  //       this._toast.error({ detail: "ERROR", summary: 'Failed To Get Stops List', duration: 5000 });
  //     }
  //   });
  // }
  filterStops() {
    if (this.sourceModel && this.destinationModel) {
      this.filteredStopsArray = this.getAllStopsListArray.filter((x: any) => x.source == this.sourceModel && x.destination == this.destinationModel);
    }
  }

  closeModal() {
    this.modal.dismiss(null, 'modal1');
  }

  getAllDepoList() {
    this._msertcService.getAllDepoList().subscribe({
      next: (res: any) => {
        this.depoList = res;
      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Depo List', duration: 5000 });
      }
    });
  }
}