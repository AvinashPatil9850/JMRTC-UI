import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MsrtcService } from '../services/msrtc.service';
import { BusListComponent } from './bus-list/bus-list.component';
import { NgToastService } from 'ng-angular-popup';
import { StopsListComponent } from './stops-list/stops-list.component';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { DepoListComponent } from './depo-list/depo-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.page.html',
  styleUrls: ['./add-bus.page.scss'],
})
export class AddBusPage implements OnInit {
  busListComponent = BusListComponent;
  stopListComponent = StopsListComponent;
  destinationListComponent = DestinationListComponent;
  depoListComponent = DepoListComponent;

  addBusForm: FormGroup;
  filteredStopsArray: any;
  getDestinationArray: any;
  getAllStopsListArray: any;
  sourceModel: string;
  destinationModel: string;
  disableBusDepoFlag = true;
  depoList: any;
  busTypeArray = ['Regular', 'Hirakani', 'Shivshahi', 'Lalpari'];
  weekDays = [
    { day: 'Monday', abbr: 'Mon' },
    { day: 'Tuesday', abbr: 'Tue' },
    { day: 'Wednesday', abbr: 'Wed' },
    { day: 'Thursday', abbr: 'Thu' },
    { day: 'Friday', abbr: 'Fri' },
    { day: 'Saturday', abbr: 'Sat' },
    { day: 'Sunday', abbr: 'Sun' },
  ];

  constructor(private fb: FormBuilder,
    private _msertcService: MsrtcService,
    private _toast: NgToastService,
    private _router: Router
  ) {


  }
  ngOnInit() {

    this.addBusInit();
    this.getAllStops();
    this.getAllDepoList();

  }

  addBusInit() {
    this.addBusForm = this.fb.group({
      busDepo: ['', Validators.required],
      busTime: ['', Validators.required],
      busType: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      busRoute: ['',],
      via: ['',],
      weekDays: new FormControl(this.weekDays),
      stops: new FormArray([
        new FormGroup({
          time: new FormControl('', Validators.required),
          stop: new FormControl('', Validators.required),
        })
      ])
    });
  }
  get stops(): FormArray {
    return this.addBusForm.get('stops') as FormArray;
  }
  addStopButton() {
    this.stops.push(new FormGroup({
      time: new FormControl('', Validators.required),
      stop: new FormControl('', Validators.required),
    }))
  }
  removeStop() {
    if (this.stops.length > 0)
      this.stops.removeAt(this.stops.length - 1);
  }
  deleteStopFromAddBus(i: any) {
    this.stops.removeAt(i);
  }
  submit() {
    let route = this.addBusForm.value.stops.map((x: any) => x.stop)
    let cRoute = route.join('-');
    this.addBusForm.patchValue({ busRoute: cRoute });
    this._msertcService.addBus(this.addBusForm.value).subscribe({
      next: res => {
        this._toast.success({ detail: "SUCCESS", summary: 'Bus Added Successfully', duration: 5000 });
        this._router.navigate(['/bus-list'])

      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'faild to add bus', duration: 5000 });
      }
    })
  }




  getAllDestination(busDepo: any) {
    debugger
    this._msertcService.getAllDestination().subscribe(res => {
      let desination: any
      desination = res;
      this.getDestinationArray = desination.filter((x: any) => x.busDepo == busDepo.value)
    })
  }
  getAllStops() {
    this._msertcService.getAllStopsList().subscribe({
      next: res => {
        this.getAllStopsListArray = res;
      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Stops List', duration: 5000 });
      }
    });
  }
  filterStops() {
    if (this.sourceModel && this.destinationModel) {
      this.filteredStopsArray = this.getAllStopsListArray.filter((x: any) => x.source == this.sourceModel && x.destination == this.destinationModel);
    }
  }

  //stops form end

  getAllDepoList() {
    debugger
    this._msertcService.getAllDepoList().subscribe({
      next: (res: any) => {
        console.log("depoList", res)
        this.depoList = res;
      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Depo List', duration: 5000 });
      }
    });
  }
}