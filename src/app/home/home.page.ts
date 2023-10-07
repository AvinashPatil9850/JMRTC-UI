import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AddBusPage } from '../add-bus/add-bus.page';
import { MsrtcService } from '../services/msrtc.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  component = AddBusPage;
  allBussessArray: any;
  searchedBussess: any = [];
  sourceName: string = '';
  destinationName: string = '';
  isSearchedBusRoute = false;
  constructor(private _msertcService: MsrtcService) { }



  sourceControl = new FormControl('');
  destinationControl = new FormControl('');
  getAllStopsList: any = [];
  filteredSoruceOptions: any;
  filteredDestinationOptions: any;

  validSource = false;
  isServerDown = false;

  ngOnInit() {

    this.getAllBusList();
    this.getAllStopsListArray();

    this.filteredSoruceOptions = this.sourceControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSource(value || '')),
    );
    this.filteredDestinationOptions = this.destinationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDestination(value || '')),
    );
    this.validSource = this.filteredSoruceOptions.length > 0;
  }
  getAllBusList() {
    this._msertcService.getAllBussess().subscribe(res => {
      this.allBussessArray = res;
    },
      (error) => {
        this.isServerDown = true;
      }
    )
  }
  getAllStopsListArray() {
    this._msertcService.GetAllRouteStopList().subscribe(res => {
      this.getAllStopsList = res;
    })
  }
  blurInput() {
    if (!this.validSource) {
      this.sourceControl.setValue("");
    }
  }
  private _filterSource(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.getAllStopsList?.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  private _filterDestination(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.getAllStopsList?.filter((option: any) => option.toLowerCase().includes(filterValue));
  }
  Source($event: string) {
    this.sourceName = $event
  }
  Destination($event: string) {
    this.destinationName = $event;
  }
  Search() {
    let searchedRoute = this.allBussessArray.filter((x: any) => x.busRoute.toLowerCase().indexOf(this.sourceName.toLowerCase()) < x.busRoute.toLowerCase().indexOf(this.destinationName.toLowerCase()))
    this.searchedBussess = searchedRoute.filter((x: any) => x.busRoute.toLowerCase().includes(this.sourceName.toLowerCase()) && x.busRoute.toLowerCase().includes(this.destinationName.toLowerCase()))
    this.isSearchedBusRoute = true;
  }


}
