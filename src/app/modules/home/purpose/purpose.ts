import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shell/footer/footer';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-purpose',
  imports: [CommonModule, Footer, RouterModule],
  templateUrl: './purpose.html',
  styleUrl: './purpose.scss',
})
export class Purpose {
  selectedIndex: number = 0;
  barTop: number = 0;
  purposeItems: any[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    this.loadPurposeItems();
  
    this.translate.onLangChange.subscribe(() => {
      this.loadPurposeItems();
    });
  }
  loadPurposeItems() {
    this.translate.get(['SERVICE_DETAILS', 'COMMON']).subscribe((res) => {
      const t = res.SERVICE_DETAILS;
      const common = res.COMMON;
  
      this.purposeItems = [
        { title: t.FEASIBILITY.TITLE, desc: t.FEASIBILITY.TEXT, button: common.BUTTON, img: '/home/gota1.png', align: 'right' },
        { title: t.REGULATORY.TITLE, desc: t.REGULATORY.TEXT, button: common.BUTTON, img: '/home/gota2.png', align: 'left' },
        { title: t.STARTUP.TITLE, desc: t.STARTUP.TEXT, button: common.BUTTON, img: '/home/gota3.png', align: 'right' },
        { title: t.BUDGET.TITLE, desc: t.BUDGET.TEXT, button: common.BUTTON, img: '/home/gota4.png', align: 'left' },
        { title: t.LOGISTICS.TITLE, desc: t.LOGISTICS.TEXT, button: common.BUTTON, img: '/home/gota5.png', align: 'right' },
        { title: t.VENDORS.TITLE, desc: t.VENDORS.TEXT, button: common.BUTTON, img: '/home/gota6.png', align: 'left' },
        { title: t.MONITORING.TITLE, desc: t.MONITORING.TEXT, button: common.BUTTON, img: '/home/gota7.png', align: 'right' },
        { title: t.ALLIANCE.TITLE, desc: t.ALLIANCE.TEXT, button: common.BUTTON, img: '/home/gota8.png', align: 'left' }
      ];
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
        offset: 50,
        startEvent: 'DOMContentLoaded',
      });
      setTimeout(() => {
        if (sessionStorage.getItem('scrollToCroExpert') === 'true') {
          sessionStorage.removeItem('scrollToCroExpert');
      
          const el = document.getElementById('cro-expert-section');
      
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
      
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        }
      }, 100);

      setTimeout(() => {
        if (sessionStorage.getItem('scrollToLatinAmerica') === 'true') {
          sessionStorage.removeItem('scrollToLatinAmerica');
      
          const el = document.getElementById('latin-america-section');
      
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
      
            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
    if (typeof window !== 'undefined') {

      setTimeout(() => {
        AOS.init({
          duration: 1200,
          once: false,
          mirror: true
        });
      }, 100);

      window.addEventListener('scroll', () => {
        AOS.refresh();
      }, { once: true });
    }
  }
  barHeight: number = 0;

  onHoverItem(index: number, event: MouseEvent): void {
    this.selectedIndex = index;
    const target = event.currentTarget as HTMLLIElement;

    if (target) {
      this.barTop = target.offsetTop;
      this.barHeight = target.offsetHeight;
    }

  }

  scrollToCard(index: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const targetId = `card-${index}`;
      const element = document.getElementById(targetId);

      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        this.selectedIndex = index;
      }
    }
  }

}
