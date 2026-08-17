import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  constructor() { }
  getGeocode(street: string, city: string, state: string): Promise<any>{
    const key = environment.GOOGLE_MAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}` + (key ? `&key=${key}` : '');
    var call = fetch(url).then(response => response.json());
    console.log(call);
    return call;
  }
}
