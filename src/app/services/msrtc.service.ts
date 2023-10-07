import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MsrtcService {
  baseUrl = 'https://localhost:7184/';

  constructor(private http: HttpClient) {
  }
  getAllBussess() {
    return this.http.get(this.baseUrl + 'GetAllBussessList')
  }
  addBus(data: any) {
    return this.http.post(this.baseUrl + 'AddBus', data);
  }
  deleteBus(data: any) {
    return this.http.post(this.baseUrl + 'DeleteBus', data);
  }
  getAllDestination() {
    return this.http.get(this.baseUrl + 'GetAllDestinationList')
  }
  addDestination(data: any) {
    return this.http.post(this.baseUrl + 'AddDestination', data);
  }
  addStops(data: any) {
    return this.http.post(this.baseUrl + 'AddStops', data);
  }
  getAllStopsList() {
    return this.http.get(this.baseUrl + 'GetAllStopsListArray')
  }
  GetAllRouteStopList() {
    return this.http.get(this.baseUrl + 'GetAllRouteStopList')
  }
  GetDestinationArr() {
    return this.http.get(this.baseUrl + 'GetDestinationArr')
  }
  deleteDestination(data: any) {
    return this.http.post(this.baseUrl + 'DeleteDestinatoin', data)
  }
  deleteStop(data: any) {
    return this.http.post(this.baseUrl + 'DeleteStops', data)
  }
}
