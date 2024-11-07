import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  constructor() { }
  getGeocode(street: string, city: string, state: string): Promise<any>{
    var call = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=AIzaSyAMUx--7BmgcJtwMZWn3pavvZuO9aMlBaA`).then(response => response.json());
    console.log(call);
    return call;
  }
}
