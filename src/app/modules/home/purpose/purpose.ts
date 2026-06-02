import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shell/footer/footer';
@Component({
  selector: 'app-purpose',
  imports: [CommonModule, Footer, RouterModule],
  templateUrl: './purpose.html',
  styleUrl: './purpose.scss',
})
export class Purpose {
  selectedIndex: number = 0;
  barTop: number = 0;
  purposeItems = [
    {
      title: 'Feasibility and site\u00A0selection',
      desc: `We have a pre-qualified sites network working with us in the different countries across Latam. These sites have gone through a rigorous feasibility process assessing patient availability, site capabilities and working procedures. We prioritize high-performing sites with proven track records to ensure fast recruitment, compliance, and study success.`,
      img: '/home/gota1.png',
      align: 'right'
    },
    {
      title: 'Regulatory requirements to conduct the\u00A0study',
      desc: 'We provide our clients with a clear overview of the regulatory requirements needed to initiate a clinical trial in each country. Our team ensures all necessary documents required in each step to obtain the study approval from the IRBs, ECs, MoH (Institutional Review Board, Ethics Committee, Ministry of Health).',
      img: '/home/gota2.png',
      align: 'left'
    },
    {
      title: 'Study set-up and startup\u00A0phase',
      desc: 'Efficient coordination of all startup activities to ensure a fast and compliant study launch. Our proactive approach minimizes delays and identifies potential obstacles to ensure a smooth study launch and avoid unnecessary and predictable hold-ups.',
      img: '/home/gota3.png',
      align: 'right'
    },
    {
      title: 'Budget and contract\u00A0negotiation',
      desc: 'We design and structure the regulatory strategy and documentation for each country, guiding submissions to IRBs, Ethics Committees, and Health Authorities through a controlled and transparent\u00A0process.',
      img: '/home/gota4.png',
      align: 'left'
    },
    {
      title: 'Logistics and importation\u00A0process',
      desc: 'We manage the end-to-end importation and logistics of clinical supplies, ensuring regulatory compliance and timely delivery to the depot. Our expertise helps navigating customs processes efficiently avoiding potential delays. A smooth importation process is key in any study\u00A0success.',
      img: '/home/gota5.png',
      align: 'right'
    },
    {
      title: 'Vendor selection and\u00A0management',
      desc: 'We contribute in identifying the external vendors needed along the study and oversee them during the clinical trial to ensure high-quality performance, compliance with regulatory requirements and alignment to study timelines and objectives.',
      img: '/home/gota6.png',
      align: 'left'
    },
    {
      title: 'Project overview and\u00A0monitoring',
      desc: 'We provide ongoing coordination and oversight of study progress through on-site and/or remote monitoring, risk assessment and performance tracking. Our team ensures adherence to protocol and local and international regulations, timelines and quality standards, keeping our clients informed at every stage.',
      img: '/home/gota7.png',
      align: 'right'
    }, {
      title: 'Cutting-edge technology for clinical trial management\u00A0(Alpha-CR)',
      desc: 'From early-phase studies to multinational trials, we provide operational clarity, regional expertise, and disciplined execution across Latin\u00A0America.',
      img: '/home/gota8.png',
      align: 'left'
    },
  ];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }


  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 1200,
        once: false,
        mirror: true,
        offset: 50,
        startEvent: 'DOMContentLoaded',
      });
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
