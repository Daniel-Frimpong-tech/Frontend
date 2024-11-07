import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateManagerService {

  state: any = {
    InputCity:'',
    InputState:'',
    overralWeatherData: {},
    weatherData: {},
    hourlyWeatherData: [],
    todayWeatherData: {},

  };

  setState(key: string, value: any){
    this.state[key] = value;
  }

  getState(key: string){
    return this.state[key];
  }

  getFullState(){
    return this.state;
  }

}
