import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpdataService {

  constructor() { }

  getIpData(): Promise<any>{
    var Ipdata = fetch('https://ipinfo.io/json?token=40e97a1962ba1e').then(response => response.json());
    console.log(Ipdata);
    return Ipdata;
  }
}
