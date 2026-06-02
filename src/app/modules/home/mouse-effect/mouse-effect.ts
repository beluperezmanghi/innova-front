import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-mouse-effect',
  templateUrl: './mouse-effect.html',
  styleUrl: './mouse-effect.css',
  standalone: true 
})
export class MouseEffect implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initEffect();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const win = window as any;
      if (typeof win.destroyParticlesLogo === 'function') {
        win.destroyParticlesLogo();
      }
    }
  }

  private initEffect(): void {
    const scriptId = 'mouse-effect-script';
    
    if (document.getElementById(scriptId)) {
      this.runAnimation();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = '/js/mouse-effect.js';
    script.async = true;
    script.onload = () => this.runAnimation();
    document.body.appendChild(script);
  }

  private runAnimation(): void {
    const win = window as any;
    if (typeof win.initParticlesLogo === 'function') {
      win.initParticlesLogo();
    }
  }
}