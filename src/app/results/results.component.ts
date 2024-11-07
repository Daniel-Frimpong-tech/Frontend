import { Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { GlobalStateManagerService } from '../global-state-manager.service';


@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  @ViewChild('noData') noData!: ElementRef;
  @ViewChild('Title') Title!: ElementRef;
constructor(
  private globalState: GlobalStateManagerService,
){}




}
