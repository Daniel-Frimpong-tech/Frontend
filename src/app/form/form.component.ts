import { TomorrowioService } from './../tomorrowio.service';
import { Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { AutocompleteComponentTest } from '../autocomplete-test/autocomplete-test.component';
import { IpdataService } from '../ipdata.service';
import { GeocodeService } from '../geocode.service';
import { GlobalStateManagerService } from '../global-state-manager.service';
import { ResultsComponent } from '../results/results.component';



@Component({
  selector: 'app-form',
  standalone: true,
  imports: [AutocompleteComponent, AutocompleteComponentTest, ResultsComponent],
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

  location: any;

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
  }

  cleardata(){
    this.street.nativeElement.value = '';
    this.autocomplete.state.nativeElement.value = '';
    this.autocompleteTest.City.nativeElement.value = '';
    this.autodetectLocation.nativeElement.checked = false;
    this.renderer.removeAttribute(this.autocompleteTest.City.nativeElement,'disabled');
    this.renderer.removeAttribute(this.autocomplete.state.nativeElement,'disabled');
    this.renderer.removeAttribute(this.street.nativeElement,'disabled');
    this.globalState.setState('overralWeatherData', null);
    this.globalState.setState('weatherData', null);
    this.globalState.setState('hourlyWeatherData', null);
    this.globalState.setState('todayWeatherData', null);
    this.renderer.setAttribute(this.results.noData.nativeElement, 'hidden', 'true');
  }

  onCheck(){
    if(this.autodetectLocation.nativeElement.checked === true){
      this.location = this.ipdataService.getIpData().then(data => {
        console.log(data);
        this.location = data.loc;
        console.log(this.location);
      });
      this.renderer.setAttribute(this.autocompleteTest.City.nativeElement,'disabled','true');
      this.renderer.setAttribute(this.autocomplete.state.nativeElement,'disabled','true');
      this.renderer.setAttribute(this.street.nativeElement,'disabled','true');
      this.autodetectLocation.nativeElement.checked = true;
    }else{
      this.renderer.removeAttribute(this.autocompleteTest.City.nativeElement,'disabled');
      this.renderer.removeAttribute(this.autocomplete.state.nativeElement,'disabled');
      this.renderer.removeAttribute(this.street.nativeElement,'disabled');
      this.autodetectLocation.nativeElement.checked = false;
    }
    
}
  onSubmit(){   
    this.geocodeService.getGeocode(this.street.nativeElement.value, this.autocompleteTest.City.nativeElement.value, this.autocompleteTest.selectedState).then(data => {
      console.log(data);
      this.location = data.results[0].geometry.location.lat + ',' + data.results[0].geometry.location.lng;
      console.log(this.location);
    });
    this.tomorrowioService.getWeather(this.location).then(data => {
      console.log(data);
      this.globalState.setState('overralWeatherData', data.data.timelines);
      this.globalState.setState('weatherData', data.data.timelines[0].intervals);
      this.globalState.setState('hourlyWeatherData', data.data.timelines[1].intervals);
      this.globalState.setState('todayWeatherData', data.data.timelines[0].intervals[0]);
    })

    if (this.street.nativeElement.value > 3 && this.autocompleteTest.City.nativeElement.value > 3 ){
      this.renderer.setAttribute(this.results.noData.nativeElement, 'hidden', 'true');
  }else{
    this.renderer.removeAttribute(this.results.noData.nativeElement, 'hidden');
  }
  this.globalState.setState('InputCity', this.autocompleteTest.City.nativeElement.value);
  this.globalState.setState('InputState', this.autocompleteTest.selectedState);
}
}