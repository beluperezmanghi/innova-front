import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos'; 

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input() background1920x1080 ="" ;
  @Input() background2440x1800 ="" ;
  @Input() backgroundMobile ="" ;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200, 
        once: false,  
        mirror: true,
        offset: 100    
      });
    }
  }
}
