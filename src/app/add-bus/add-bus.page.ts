import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MsrtcService } from '../services/msrtc.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { BusListComponent } from './bus-list/bus-list.component';
import { NgToastService } from 'ng-angular-popup';
import { StopsListComponent } from './stops-list/stops-list.component';
import { DestinationListComponent } from './destination-list/destination-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.page.html',
  styleUrls: ['./add-bus.page.scss'],
})
export class AddBusPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonModal) modalAddStop: IonModal;
  busListComponent = BusListComponent;
  stopListComponent = StopsListComponent;
  destinationListComponent = DestinationListComponent;

  addBusForm: FormGroup;
  addStopsArr: any;
  addDestinationsForm: FormGroup;
  addStopsForm: FormGroup;
  addDestinationArr: any;
  getDestinationArray: any;
  getAllStopsListArray: any;
  sourceModel: string;
  destinationModel: string;
  disableBusDepoFlag = true;
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
    private _router: Router,
  ) {


  }
  ngOnInit() {
    this.addBusForm = this.fb.group({
      busDepo: ['Jamner', Validators.required],
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
    this.addDestinationOnInit();
    this.addStopsOnInit();
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
      },
      error: error => {
        this._toast.error({ detail: "ERROR", summary: 'faild to add bus', duration: 5000 });
      }
    })
  }


  addDestinationOnInit() {
    this.addDestinationsForm = this.fb.group({
      busDepo: ['Jamner', Validators.required],
      destinationArr: new FormArray([
        new FormGroup({
          destination: new FormControl('', Validators.required),
        })
      ])
    });
    this.getAllDestination();
  }
  get destinationArr(): FormArray {
    return this.addDestinationsForm.get('destinationArr') as FormArray;
  }
  getAllDestination() {
    this._msertcService.getAllDestination().subscribe(res => {
      let desination: any
      desination = res;
      this.getDestinationArray = desination.filter((x: any) => x.busDepo == 'Jamner')
    })
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
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
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

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  //stops form start
  addStopsOnInit() {
    this.addStopsForm = this.fb.group({
      busDepo: ['Jamner', Validators.required],
      destination: ['', Validators.required],
      source: ['Jamner', Validators.required],
      stopsList: new FormArray([
        new FormGroup({
          stopName: new FormControl('', Validators.required),
        })
      ])
    });
    this.getAllStops();
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
  cancelAddStops() {
    this.modalAddStop.dismiss(null, 'modal1');
  }

  confirmAddStops() {
    this._msertcService.addStops(this.addStopsForm.value).subscribe({
      next: res => {
        this.modalAddStop.dismiss('confirm', 'modal1');
        this.getAllStops();
        this._toast.success({ detail: "SUCCESS", summary: 'Stops Added successfulley', duration: 5000 });
      },
      error: error => {
        this.modalAddStop.dismiss('confirm', 'modal1');
        this._toast.error({ detail: "ERROR", summary: 'Failed To Add', duration: 5000 });
      }
    })
  }
  getAllStops() {
    this._msertcService.getAllStopsList().subscribe({
      next: res => {
        this.getAllStopsListArray = res;
      },
      error: error => {
        this.modal.dismiss('confirm', 'modal1');
        this._toast.error({ detail: "ERROR", summary: 'Failed To Get Stops List', duration: 5000 });
      }
    });
  }
  filteredStopsArray: any;
  filterStops() {
    if (this.sourceModel && this.destinationModel) {
      this.filteredStopsArray = this.getAllStopsListArray.filter((x: any) => x.source == this.sourceModel && x.destination == this.destinationModel);
    }
  }
  onStopsWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  //stops form end
}