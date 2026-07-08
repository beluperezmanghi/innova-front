import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';import * as AOS from 'aos';
import { Footer } from '../../shell/footer/footer';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-our-approach',
  imports: [CommonModule, Footer, TranslatePipe],
  templateUrl: './our-approach.html',
  styleUrl: './our-approach.scss',
})

export class OurApproach {
  persons: any[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private translate: TranslateService
) {
  this.loadPersons();

  this.translate.onLangChange.subscribe(() => {
    this.loadPersons();
  });
}

loadPersons() {
  this.translate.get(['TEAM', 'TEAM_LARGE']).subscribe((res) => {
    const team = res.TEAM;
    const large = res.TEAM_LARGE;

    this.persons = [
      {
        in: "https://www.linkedin.com/in/federico-p%C3%A9rez-manghi-md-cpi-91770925",
        img: "/persons/person1.jpg",
        imgMob: "/persons/person1-mob.png",
        fullname: team.FEDERICO.NAME,
        position1: team.FEDERICO.ROLE1,
        position2: team.FEDERICO.ROLE2,
        description: `${large.FEDERICO.BIO1}<br><br>${large.FEDERICO.BIO2}<br><br>${large.FEDERICO.BIO3}`
      },
      {
        in: "https://www.linkedin.com/in/milagros-p%C3%A9rez-manghi-93153512a/",
        img: "/persons/person2.jpg",
        imgMob: "/persons/person2-mob.png",
        fullname: team.MILAGROS.NAME,
        position1: team.MILAGROS.ROLE1,
        position2: team.MILAGROS.ROLE2,
        description: `${large.MILAGROS.BIO1}<br><br>${large.MILAGROS.BIO2}<br><br>${large.MILAGROS.BIO3}`
      },
      {
        in: "https://www.linkedin.com/in/santiagoip/en",
        img: "/persons/person3.jpg",
        imgMob: "/persons/person3-mob.png",
        fullname: team.SANTIAGO.NAME,
        position1: team.SANTIAGO.ROLE1,
        position2: team.SANTIAGO.ROLE2,
        description: `${large.SANTIAGO.BIO1}<br><br>${large.SANTIAGO.BIO2}${large.SANTIAGO.BIO3 ? '<br><br>' + large.SANTIAGO.BIO3 : ''}`
      },
      {
        in: "https://www.linkedin.com/in/daniel-a-cascon-57a19b7",
        img: "/persons/person4.jpg",
        imgMob: "/persons/person4-mob.png",
        fullname: team.DANIEL.NAME,
        position1: team.DANIEL.ROLE1,
        position2: team.DANIEL.ROLE2,
        description: `${large.DANIEL.BIO1}<br><br>${large.DANIEL.BIO2}<br><br>${large.DANIEL.BIO3}`
      }
    ];
  });
}

  selectedIndex: number = 0;
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
      });
      setTimeout(() => {
        if (sessionStorage.getItem('scrollToInnovation') === 'true') {
          sessionStorage.removeItem('scrollToInnovation');
      
          const el = document.getElementById('innovation-section');
      
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
  }
  scrollToPerson(index: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const targetId = `person-${index}`;
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

  expandedIndex: number | null = null;

  handleCardClick(index: number) {
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      this.expandedIndex = this.expandedIndex === index ? null : index;

      setTimeout(() => AOS.refresh(), 300);
    } else {
      this.scrollToPerson(index);
    }
  }

  goToExternalUrl(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    }
  }
}
