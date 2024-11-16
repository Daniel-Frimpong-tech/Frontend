import { TomorrowioService } from '../tomorrowio.service';
import { Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { AutocompleteComponentTest } from '../autocomplete-test/autocomplete-test.component';
import { IpdataService } from '../ipdata.service';
import { GeocodeService } from '../geocode.service';
import { GlobalStateManagerService } from '../global-state-manager.service';
import { ResultsComponent } from '../results/results.component';
import { error } from 'highcharts';
import { CommonModule } from '@angular/common';






@Component({
  selector: 'app-form',
  standalone: true,
  imports: [AutocompleteComponent, AutocompleteComponentTest, ResultsComponent,CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @ViewChild('street') street!: ElementRef;
  @ViewChild('form') form!: ElementRef;
  @ViewChild('autodetectLocation') autodetectLocation!: ElementRef;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;
  @ViewChild(AutocompleteComponentTest) autocompleteTest!: AutocompleteComponentTest;
  @ViewChild(ResultsComponent) results!: ResultsComponent;
  @ViewChild('search') search!: ElementRef;

  location: any;
  stateAutoDetect: any;
  cityAutoDetect: any;
  

  constructor(
    private renderer: Renderer2,
    private ipdataService: IpdataService,
    private geocodeService: GeocodeService,
    private tomorrowioService: TomorrowioService,
    private globalState: GlobalStateManagerService,
  ) {}

  onfullStateReady(fullState: string){
    console.log(fullState);
    this.autocomplete.state.nativeElement.value = fullState;
  }

  validateStreet(){
    if (this.street.nativeElement.value === '') {
      this.renderer.addClass(this.street.nativeElement, 'is-invalid');
  }else if (this.street.nativeElement.value !== '') {
    this.renderer.removeClass(this.street.nativeElement, 'is-invalid');
  }
}

  checkFormInputs(){
    if (this.street.nativeElement.value !==''){
      this.renderer.removeClass(this.street.nativeElement, 'is-invalid');
    }
    if(this.autocomplete.state.nativeElement.value !== ''){
      this.renderer.removeClass(this.autocomplete.state.nativeElement, 'is-invalid');
    }
    if(this.autocompleteTest.City.nativeElement.value !== ''){
      this.renderer.removeClass(this.autocompleteTest.City.nativeElement, 'is-invalid');
    }
    
    if(this.street.nativeElement.value.length < 1 || this.autocompleteTest.City.nativeElement.value.length < 1 || this.autocomplete.state.nativeElement.value.length < 1){
      this.renderer.setAttribute(this.search.nativeElement, 'disabled', 'true');
    }

    if(this.street.nativeElement.value.length >= 1 && this.autocompleteTest.City.nativeElement.value.length >= 1 && this.autocomplete.state.nativeElement.value.length >= 1){
      this.renderer.removeAttribute(this.search.nativeElement, 'disabled');
    }

  }

  cleardata(){
    this.location = '';
    this.street.nativeElement.value = '';
    this.autocomplete.state.nativeElement.value = '';
    this.autocompleteTest.City.nativeElement.value = '';
    this.autodetectLocation.nativeElement.checked = false;
    this.renderer.removeAttribute(this.autocompleteTest.City.nativeElement,'disabled');
    this.renderer.removeAttribute(this.autocomplete.state.nativeElement,'disabled');
    this.renderer.removeAttribute(this.street.nativeElement,'disabled');
    this.globalState.clearState();
    this.renderer.setAttribute(this.results.noData.nativeElement, 'hidden', 'true');
    this.renderer.setAttribute(this.search.nativeElement, 'disabled', 'true');
    this.results.clearData();
    this.results.showDayDetails = false;
  }




  onCheck(){

    if(this.autodetectLocation.nativeElement.checked === true){
      this.renderer.removeAttribute(this.search.nativeElement, 'disabled');
      this.autodetectLocation.nativeElement.color ='yellow';
      this.location = this.ipdataService.getIpData().then(data => {
        console.log(data);
        this.location = data.loc.toString();
        this.stateAutoDetect = data.region;
        this.cityAutoDetect = data.city;
        console.log(this.stateAutoDetect);
        console.log(this.cityAutoDetect);
        console.log(this.location);
        this.globalState.setState('location', this.location);
      });
      this.renderer.setAttribute(this.autocompleteTest.City.nativeElement,'disabled','true');
      this.renderer.setAttribute(this.autocomplete.state.nativeElement,'disabled','true');
      this.renderer.setAttribute(this.street.nativeElement,'disabled','true');
      this.autodetectLocation.nativeElement.checked = true;
    }else{
      this.renderer.setAttribute(this.search.nativeElement, 'disabled', 'true');
      this.renderer.removeAttribute(this.autocompleteTest.City.nativeElement,'disabled');
      this.renderer.removeAttribute(this.autocomplete.state.nativeElement,'disabled');
      this.renderer.removeAttribute(this.street.nativeElement,'disabled');
      this.autodetectLocation.nativeElement.checked = false;
    }
    
}
  onSubmit(){ 

    this.results.showDayDetails = true;
    if (this.autodetectLocation.nativeElement.checked === true){
      this.tomorrowioService.getWeather(this.location).then(data => {
        console.log(data);
        if (data.error){
          this.globalState.setState('tomorrowErrorMg', data.error.message);
          console.log(this.globalState.getState('tomorrowErrorMg'));
          this.results.display();
        }

        this.globalState.setState('overralWeatherData', data.data.timelines);
        this.globalState.setState('weatherData', data.data.timelines[0].intervals);
        this.globalState.setState('hourlyWeatherData', data.data.timelines[1].intervals);
        this.globalState.setState('todayWeatherData', data.data.timelines[0].intervals[0]);
        this.validateEntry();
        this.results.display();
      });
      this.globalState.setState('InputCity', this.cityAutoDetect);
      this.globalState.setState('InputState', this.stateAutoDetect);
    
    }else{  
      if(this.street.nativeElement.value.length < 3 && this.autocompleteTest.City.nativeElement.value.length < 3){
        this.results.display();
        return
      }else{
        this.geocodeService.getGeocode(this.street.nativeElement.value, this.autocompleteTest.City.nativeElement.value, this.autocompleteTest.selectedState).then(data => {
          console.log(data);
          this.location = data.results[0].geometry.location.lat + ',' + data.results[0].geometry.location.lng;
          console.log(this.location);
          this.globalState.setState('location', this.location);
        });
      }
    
    setTimeout(()=>{
      console.log(this.location);
      this.tomorrowioService.getWeather(this.location).then(data => {
        console.log(data);
        this.globalState.setState('location', this.location);
        if (data.error){
          this.globalState.setState('tomorrowErrorMg', data.error.message);
          console.log(this.globalState.getState('tomorrowErrorMg'));
          this.results.display();
        }
        this.globalState.setState('overralWeatherData', data.data.timelines);
        this.globalState.setState('weatherData', data.data.timelines[0].intervals);
        this.globalState.setState('hourlyWeatherData', data.data.timelines[1].intervals);
        this.globalState.setState('todayWeatherData', data.data.timelines[0].intervals[0]);
        });
        
        this.globalState.setState('InputCity', this.autocompleteTest.City.nativeElement.value.split(',')[0].toString());
        this.globalState.setState('InputState', this.autocomplete.state.nativeElement.value.toString());
        this.validateEntry();
        console.log(this.globalState.getState('InputCity'));
        console.log(this.globalState.getState('InputState'));
        this.results.display();
    }, 1000);

    this.results.checkIfinFav();
    
  }
  }

  validateEntry(){
    setTimeout(()=>{
      if ((this.street.nativeElement.value.length < 3 && this.autocompleteTest.City.nativeElement.value.length < 3 && this.autocomplete.state.nativeElement.value.length && this.autodetectLocation.nativeElement.checked === false)){
        this.renderer.removeAttribute(this.results.noData.nativeElement, 'hidden');
        console.log('no data');
        return;
    }

    if(this.autodetectLocation.nativeElement.checked === true && (this.location === undefined || this.location === '')){
      this.renderer.removeAttribute(this.results.noData.nativeElement, 'hidden');
      console.log('no data');
      return;
    }
  
    if(this.street.nativeElement.value.length >= 3 && this.autocompleteTest.City.nativeElement.value.length >= 3 && this.autocomplete.state.nativeElement.value.length >= 3 && this.autodetectLocation.nativeElement.checked === false && this.location !== undefined && this.location !== ''){
      this.renderer.setAttribute(this.results.noData.nativeElement, 'hidden', 'true');

      if(this.globalState.getState('tomorrowErrorMg') === 'Tomorrow.io hit limit'){
        this.renderer.removeAttribute(this.results.noData.nativeElement, 'hidden');
        console.log('no data');

      }
  
      if(this.globalState.getState('tomorrowErrorMg') !== 'Tomorrow.io hit limit'){
        this.renderer.setAttribute(this.results.noData.nativeElement, 'hidden', 'true');
      }
  
      if(this.globalState.getState('tomorrowErrorMg')== error){
        this.renderer.removeAttribute(this.results.noData.nativeElement, 'hidden');
        console.log('no data');
      }
     
      this.renderer.setAttribute(this.results.progress.nativeElement, 'hidden', 'true');
    }}, 1000);
    
  
  }

}