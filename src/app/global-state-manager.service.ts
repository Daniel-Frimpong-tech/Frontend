import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateManagerService {

  state: any = {
    InputCity:'',
    InputState:'',
    tomorrowErrorMg: '',
    overralWeatherData: {},
    weatherData: [],
    hourlyWeatherData: [],
    icon: '',
    icontext: '',
    weekDetails: [],
    selectedDayDetails: [],
    selectedDayStatus:[],
    location: '',
  };

  setState(key: string, value: any){
    this.state[key] = value;
  }

  getState(key: string){
    if (this.state[key] === undefined){
      this.setState('tomorrowErrorMg', this.state[key].error.message);
    }
    if (this.state[key].error){
      this.setState('tomorrowErrorMg', this.state[key].error.message);
    }
    return this.state[key];
  }

  getFullState(){
    if (this.state === undefined){
      this.setState('tomorrowErrorMg', this.state.error.message);
    }
    if (this.state.error){
      this.setState('tomorrowErrorMg', this.state.error.message);
    }
    return this.state;
  }

  pushState(key: string, value: any){
    this.state[key].push(value);
  }

  

  clearState(){
    this.state = {
      InputCity:'',
      InputState:'',
      tomorrowErrorMg: '',
      overralWeatherData: {},
      weatherData: [],
      hourlyWeatherData: [],
      icon: '',
      icontext: '',
      weekDetails: [],
      selectedDayDetails: [],
      selectedDayStatus:[],
      location: '',
    };
  }

}
