import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { NgToastService } from 'ng-angular-popup';
import { MsrtcService } from 'src/app/services/msrtc.service';
import { BusListCellRendererComponent } from '../bus-list/bus-list-cell-renderer/bus-list-cell-renderer.component';
import { IonModal } from '@ionic/angular';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.scss'],
})
export class DestinationListComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  allDestinationArray: any;
  gridOptions: GridOptions;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  paginationSize: number = 10;
  columnDefs: ColDef[] = [];
  depoList: any;
  constructor(private _msertcService: MsrtcService,
    private _toast: NgToastService,
    private fb: FormBuilder,) {
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      // enable filtering 
      enableFilter: true
    };

  }


  ngOnInit() {

    this.getAllDestination();
    this.addDestinationOnInit();
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


  getAllDestination() {
    this._msertcService.getAllDestination().subscribe({
      next: (res: any) => {
        this.allDestinationArray = res;
        this.rowData = this.allDestinationArray;
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
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Destination List', duration: 5000 });
      }
    });
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
        headerName: 'Destination', field: 'destination',
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
        destinationID: params?.data.destinationID
      }
      this._msertcService.deleteDestination(deleteObj).subscribe({
        next: res => {
          this.getAllDestination();
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

  // modal 

  addDestinationsForm: FormGroup;

  addDestinationOnInit() {
    this.addDestinationsForm = this.fb.group({
      busDepo: ['Jamner', Validators.required],
      destinationArr: new FormArray([
        new FormGroup({
          destination: new FormControl('', Validators.required),
        })
      ])
    });
  }
  get destinationArr(): FormArray {
    return this.addDestinationsForm.get('destinationArr') as FormArray;
  }

  addDestination() {
    this.destinationArr.push(new FormGroup({
      destination: new FormControl(''),
    }))
  }

  removeDestination() {
    if (this.destinationArr.length > 0)
      this.destinationArr.removeAt(this.destinationArr.length - 1);
  }
  deleteThisDestination(i: any) {
    this.destinationArr.removeAt(i);
  }

  confirm() {
    // let defaultDestination = this.destinationArr.get('busDepo')?.value
    console.log("add-destination", this.addDestinationsForm.value)

    this._msertcService.addDestination(this.addDestinationsForm.value).subscribe({
      next: res => {
        this.modal.dismiss(null, 'cancel');
        this.getAllDestination();
        this._toast.success({ detail: "SUCCESS", summary: 'Destination Added successfulley', duration: 5000 });
      },
      error: error => {
        this.modal.dismiss(null, 'cancel');
        this._toast.error({ detail: "ERROR", summary: 'Failed To Add', duration: 5000 });
      }
    })
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
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