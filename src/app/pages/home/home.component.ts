import { Component } from '@angular/core';
import {TranslateDirective, TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, TranslateDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
