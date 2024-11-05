import { Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { AutocompleteComponentTest } from '../autocomplete-test/autocomplete-test.component';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [AutocompleteComponent, AutocompleteComponentTest],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  @ViewChild('street') street!: ElementRef;
  @ViewChild('form') form!: ElementRef;
  @ViewChild(AutocompleteComponent) autocomplete!: AutocompleteComponent;
  @ViewChild(AutocompleteComponentTest) autocompleteTest!: AutocompleteComponentTest;



  constructor(
    private renderer: Renderer2,
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
  
}
