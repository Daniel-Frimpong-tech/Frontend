
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TomorrowioService {

  constructor() { }

  getWeather(location: string): Promise<any>{
    var weather = fetch(`${environment.API_BASE_URL}/api/weather?location=${location}`).then(response => response.json());
    console.log(weather);
    
    return weather;
  }
}
