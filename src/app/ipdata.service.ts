import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpdataService {

  constructor() { }

  getIpData(): Promise<any>{
    const token = environment.IPINFO_TOKEN;
    const url = `https://ipinfo.io/json` + (token ? `?token=${token}` : '');
    var Ipdata = fetch(url).then(response => response.json());
    console.log(Ipdata);
    return Ipdata;
  }
}
