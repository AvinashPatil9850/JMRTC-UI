import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { NgToastService } from 'ng-angular-popup';
import { MsrtcService } from 'src/app/services/msrtc.service';
import { BusListCellRendererComponent } from '../bus-list/bus-list-cell-renderer/bus-list-cell-renderer.component';

@Component({
  selector: 'app-depo-list',
  templateUrl: './depo-list.component.html',
  styleUrls: ['./depo-list.component.scss'],
})
export class DepoListComponent implements OnInit {
  addDepoForm: FormGroup;
  @ViewChild(IonModal) modal: IonModal;
  public rowData$: any;
  gridOptions: GridOptions;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  paginationSize: number = 10;
  columnDefs: ColDef[] = [];
  depoList = [];
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

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;


  constructor(
    private _msertcService: MsrtcService,
    private _toast: NgToastService,
    private fb: FormBuilder,
  ) { }



  ngOnInit() {
    this.addDepoOnInit();
    this.getAllDepoList();
  }

  addDepoOnInit() {
    this.addDepoForm = this.fb.group({
      busDepo: ['', Validators.required],
      subDistrict: ['', Validators.required],
      district: ['', Validators.required],

    });
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }
  getAllDepoList() {
    this._msertcService.getAllDepoList().subscribe({
      next: (res: any) => {
        this.depoList = res;
        this.rowData = this.depoList;
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
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Depo List', duration: 5000 });
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
        headerName: 'Sub District', field: 'subDistrict',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },
      {
        headerName: 'District', field: 'district',
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        width: 200,
        suppressMenu: true,
        suppressMovable: true,
        lockVisible: false,
        unSortIcon: true
      },

      {
        headerName: 'Action', minWidth: 175,
        cellRenderer: BusListCellRendererComponent,
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

  onBtnCellRendererClick(params: ICellRendererParams) {
    let data: any = params
    if (data.action == 'delete') {
      let deleteObj = {
        depoID: params?.data.depoID
      }
      this._msertcService.deleteDepo(deleteObj).subscribe({
        next: res => {
          this.getAllDepoList();
          this.gridApi.refreshCells()
          this._toast.success({ detail: "SUCCESS", summary: 'Record deleted successfulley', duration: 5000 });
        },
        error: error => {
          this._toast.error({ detail: "ERROR", summary: "Failed To Get Details", duration: 5000 });
        }
      }
      );
    }
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  confirm() {
    this._msertcService.adddDepo(this.addDepoForm.value).subscribe({
      next: res => {
        this.modal.dismiss(null, 'cancel');
        this.getAllDepoList();
        this._toast.success({ detail: "SUCCESS", summary: 'Depo Added successfulley', duration: 5000 });
      },
      error: error => {
        this.modal.dismiss(null, 'cancel');
        this._toast.error({ detail: "ERROR", summary: error?.error, duration: 5000 });
      }
    })
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }
}
