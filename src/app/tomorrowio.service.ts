import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TomorrowioService {

  constructor() { }

  getWeather(location: string): Promise<any>{
    var weather = fetch(`http://localhost:3000/api/weather?location=${location}`).then(response => response.json());
    console.log(weather);
    
    return weather;
  }
}
