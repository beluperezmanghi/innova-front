import {
  Component
} from '@angular/core';
import { Purpose } from '../purpose/purpose';
import { MouseEffect } from '../mouse-effect/mouse-effect';
@Component({
  selector: 'app-home',
  imports: [Purpose,MouseEffect],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  constructor() { }


}
